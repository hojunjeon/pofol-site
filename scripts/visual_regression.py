#!/usr/bin/env python3
"""Render all nine boards and write a transparent visual-regression report."""
from __future__ import annotations

import json
import statistics
from pathlib import Path

from playwright.sync_api import sync_playwright

from visual_common import (
    BASELINE_GENES,
    OUTPUT_DIR,
    REFERENCE_DIR,
    REFERENCE_FILES,
    ROOT,
    TARGETS,
    chromium_executable,
    ensure_server,
    make_contact_sheet,
    render_project,
    rounded_report,
    score_render,
)


def load_genes() -> dict[str, float]:
    report_path = ROOT / "ga-report.json"
    if not report_path.exists():
        return dict(BASELINE_GENES)
    report = json.loads(report_path.read_text(encoding="utf-8"))
    return {key: float(value) for key, value in report["bestGenes"].items()}


def main() -> None:
    genes = load_genes()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    server = ensure_server()
    results = {}
    entries = []
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(
                executable_path=chromium_executable(),
                headless=True,
                args=["--no-sandbox", "--disable-dev-shm-usage"],
            )
            page = browser.new_page(device_scale_factor=1)
            for slug in TARGETS:
                screenshot, layout = render_project(page, slug, genes)
                path = OUTPUT_DIR / f"final-{slug}.png"
                path.write_bytes(screenshot)
                results[slug] = score_render(slug, screenshot, layout)
                entries.append((slug, REFERENCE_DIR / REFERENCE_FILES[slug], path))
                print(f"{slug:12s} {results[slug]['weightedSimilarity'] * 100:6.2f}%")
            browser.close()
    finally:
        server.close()

    summary = {
        "weightedSimilarity": statistics.fmean(item["weightedSimilarity"] for item in results.values()),
        "geometry": statistics.fmean(item["geometry"] for item in results.values()),
        "representativeMedia": statistics.fmean(item["representativeMedia"] for item in results.values()),
        "lowFrequencySSIM": statistics.fmean(item["lowFrequencySSIM"] for item in results.values()),
        "rawThumbnailSSIM": statistics.fmean(item["rawThumbnailSSIM"] for item in results.values()),
    }
    report = {
        "metric": {
            "name": "structure-weighted visual similarity",
            "weights": {"majorRegionGeometry": 0.60, "representativeMedia": 0.25, "lowFrequencySSIM": 0.15},
            "rawScore": "256px unblurred grayscale SSIM, reported separately",
        },
        "genes": genes,
        "summary": summary,
        "projects": results,
    }
    report_path = ROOT / "visual-report.json"
    report_path.write_text(json.dumps(rounded_report(report), ensure_ascii=False, indent=2), encoding="utf-8")
    make_contact_sheet(entries, OUTPUT_DIR / "contact-sheet.jpg")
    print(f"average weighted similarity: {summary['weightedSimilarity'] * 100:.2f}%")
    print(f"average raw thumbnail SSIM: {summary['rawThumbnailSSIM'] * 100:.2f}%")
    print(f"wrote {report_path}")


if __name__ == "__main__":
    main()
