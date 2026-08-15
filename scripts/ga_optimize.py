#!/usr/bin/env python3
"""Narrow genetic search over the shared portfolio design tokens."""
from __future__ import annotations

import json
import math
import random
import statistics
from copy import deepcopy
from pathlib import Path
from typing import Any

from playwright.sync_api import sync_playwright

from visual_common import (
    BASELINE_GENES,
    OUTPUT_DIR,
    ROOT,
    TARGETS,
    chromium_executable,
    css_text,
    ensure_server,
    render_project,
    rounded_report,
    score_render,
)

SEED = 20260814
POPULATION_SIZE = 4
GENERATIONS = 2
ELITE_COUNT = 2
REPRESENTATIVE_PROJECTS = ("pathfinder", "hermes", "ros2")
ALL_PROJECTS = tuple(TARGETS)

# The board geometry is already measured and encoded in project-specific CSS.
# The GA therefore explores only a narrow, sane neighborhood of the reusable
# design tokens instead of mutating the layout into modern-art shrapnel.
BOUNDS: dict[str, tuple[float, float]] = {
    "paperPaddingX": (52.8, 53.2),
    "paperPaddingY": (41.7, 42.3),
    "titleSize": (43.6, 44.4),
    "baseSize": (13.86, 14.14),
    "moduleGap": (15.6, 16.4),
    "sectionGap": (23.6, 24.4),
    "cardRadius": (10.6, 11.4),
    "watermarkSize": (92.5, 95.5),
    "factGap": (27.4, 28.6),
    "density": (0.996, 1.004),
    "borderAlpha": (0.150, 0.170),
}


def clamp(value: float, bounds: tuple[float, float]) -> float:
    return min(bounds[1], max(bounds[0], value))


def random_individual(rng: random.Random) -> dict[str, float]:
    individual: dict[str, float] = {}
    for key, (low, high) in BOUNDS.items():
        center = BASELINE_GENES[key]
        sigma = (high - low) / 5.5
        individual[key] = clamp(rng.gauss(center, sigma), (low, high))
    return individual


def key_for(individual: dict[str, float]) -> tuple[float, ...]:
    return tuple(round(individual[key], 5) for key in BOUNDS)


def tournament(population: list[dict[str, Any]], rng: random.Random, size: int = 3) -> dict[str, float]:
    sampled = rng.sample(population, k=min(size, len(population)))
    return deepcopy(max(sampled, key=lambda item: item["fitness"])["genes"])


def crossover(a: dict[str, float], b: dict[str, float], rng: random.Random) -> dict[str, float]:
    child: dict[str, float] = {}
    for key, bounds in BOUNDS.items():
        alpha = rng.uniform(-0.12, 1.12)
        child[key] = clamp(alpha * a[key] + (1.0 - alpha) * b[key], bounds)
    return child


def mutate(individual: dict[str, float], rng: random.Random, generation: int) -> dict[str, float]:
    progress = generation / max(1, GENERATIONS - 1)
    scale = 1.0 - 0.58 * progress
    for key, bounds in BOUNDS.items():
        if rng.random() < 0.34:
            sigma = (bounds[1] - bounds[0]) * 0.11 * scale
            individual[key] = clamp(individual[key] + rng.gauss(0, sigma), bounds)
    return individual


def main() -> None:
    rng = random.Random(SEED)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    server = ensure_server()
    cache: dict[tuple[float, ...], dict[str, Any]] = {}
    history: list[dict[str, Any]] = []

    try:
        with sync_playwright() as playwright:
            executable = chromium_executable()
            browser = playwright.chromium.launch(
                executable_path=executable,
                headless=True,
                args=["--no-sandbox", "--disable-dev-shm-usage"],
            )
            def evaluate(genes: dict[str, float]) -> dict[str, Any]:
                cache_key = key_for(genes)
                if cache_key in cache:
                    return cache[cache_key]
                projects: dict[str, Any] = {}
                page = browser.new_page(device_scale_factor=1)
                page.set_default_timeout(7000)
                page.set_default_navigation_timeout(7000)
                try:
                    for slug in REPRESENTATIVE_PROJECTS:
                        screenshot, layout = render_project(page, slug, genes, fast=True)
                        projects[slug] = score_render(slug, screenshot, layout)
                    fitness = statistics.fmean(item["weightedSimilarity"] for item in projects.values())
                    result = {"fitness": fitness, "projects": projects}
                except Exception as error:
                    # A broken chromosome is simply unfit; it does not get to
                    # stall the whole population like an executive meeting.
                    result = {"fitness": 0.0, "projects": {}, "error": str(error)}
                finally:
                    page.close()
                cache[cache_key] = result
                return result

            population_genes = [deepcopy(BASELINE_GENES)] + [random_individual(rng) for _ in range(POPULATION_SIZE - 1)]
            population: list[dict[str, Any]] = []

            for generation in range(GENERATIONS):
                population = []
                for genes in population_genes:
                    result = evaluate(genes)
                    population.append({"genes": genes, "fitness": result["fitness"], "projects": result["projects"]})
                population.sort(key=lambda item: item["fitness"], reverse=True)
                history.append({
                    "generation": generation,
                    "best": population[0]["fitness"],
                    "mean": statistics.fmean(item["fitness"] for item in population),
                    "worst": population[-1]["fitness"],
                    "bestGenes": population[0]["genes"],
                })
                print(
                    f"generation {generation + 1}/{GENERATIONS}  "
                    f"best={population[0]['fitness']:.5f}  "
                    f"mean={history[-1]['mean']:.5f}"
                )
                if generation == GENERATIONS - 1:
                    break
                next_generation = [deepcopy(item["genes"]) for item in population[:ELITE_COUNT]]
                while len(next_generation) < POPULATION_SIZE:
                    parent_a = tournament(population, rng)
                    parent_b = tournament(population, rng)
                    child = crossover(parent_a, parent_b, rng)
                    next_generation.append(mutate(child, rng, generation))
                population_genes = next_generation

            best = deepcopy(population[0]["genes"])
            final_projects: dict[str, Any] = {}
            screenshots: list[tuple[str, Path, Path]] = []
            final_page = browser.new_page(device_scale_factor=1)
            final_page.set_default_timeout(7000)
            final_page.set_default_navigation_timeout(7000)
            for slug in ALL_PROJECTS:
                screenshot, layout = render_project(final_page, slug, best)
                score = score_render(slug, screenshot, layout)
                final_projects[slug] = score
                render_path = OUTPUT_DIR / f"ga-best-{slug}.png"
                render_path.write_bytes(screenshot)
                screenshots.append((slug, ROOT / "references" / {
                    "ggeolgeol": "01_ggeolgeol.png",
                    "pathfinder": "02_pathfinder.png",
                    "aegis": "03_aegis.png",
                    "hermes": "04_hermes.png",
                    "parking": "05_parking.png",
                    "apple": "06_apple_robot.png",
                    "rl": "07_rl_orchestration.png",
                    "competition": "08_autonomous_competition.png",
                    "ros2": "09_ros2_gazebo.png",
                }[slug], render_path))
            final_page.close()

            browser.close()

        final_weighted = statistics.fmean(item["weightedSimilarity"] for item in final_projects.values())
        final_raw = statistics.fmean(item["rawThumbnailSSIM"] for item in final_projects.values())
        final_geometry = statistics.fmean(item["geometry"] for item in final_projects.values())
        report = {
            "algorithm": {
                "name": "elitist real-valued genetic algorithm",
                "seed": SEED,
                "population": POPULATION_SIZE,
                "generations": GENERATIONS,
                "eliteCount": ELITE_COUNT,
                "selection": "3-way tournament",
                "crossover": "blend crossover",
                "mutation": "annealed Gaussian mutation",
                "representativeProjects": list(REPRESENTATIVE_PROJECTS),
                "evaluatedChromosomes": len(cache),
            },
            "fitnessDefinition": {
                "structureGeometry": 0.60,
                "representativeMedia": 0.25,
                "lowFrequencySSIM": 0.15,
                "note": "System-font glyph rasterization and tiny illustration details are intentionally downweighted; raw thumbnail SSIM is reported separately.",
            },
            "bestGenes": best,
            "history": history,
            "final": {
                "weightedSimilarity": final_weighted,
                "geometry": final_geometry,
                "rawThumbnailSSIM": final_raw,
                "projects": final_projects,
            },
        }
        (ROOT / "ga-best.css").write_text(css_text(best), encoding="utf-8")
        (ROOT / "ga-report.json").write_text(json.dumps(rounded_report(report), ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"final weighted similarity: {final_weighted * 100:.2f}%")
        print(f"raw 256px thumbnail SSIM: {final_raw * 100:.2f}%")
        print(f"wrote {ROOT / 'ga-best.css'}")
        print(f"wrote {ROOT / 'ga-report.json'}")
    finally:
        server.close()


if __name__ == "__main__":
    main()
