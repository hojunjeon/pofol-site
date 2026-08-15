"""Shared visual-regression helpers for the portfolio board renderer.

The score is intentionally structure-weighted. It measures the geometry of the
major UI regions, the representative-media region, and a low-frequency visual
map. Glyph antialiasing and tiny illustration details are downweighted because
those vary across operating systems even when the CSS layout is identical.
"""
from __future__ import annotations

import base64
import io
import json
import math
import os
import socket
import subprocess
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

import cv2
import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps
from skimage.metrics import structural_similarity as ssim

ROOT = Path(__file__).resolve().parents[1]
REFERENCE_DIR = ROOT / "references"
OUTPUT_DIR = ROOT / "visual-output"
BASE_URL = os.environ.get("PORTFOLIO_BASE_URL", "http://127.0.0.1:4173")

REFERENCE_FILES = {
    "ggeolgeol": "01_ggeolgeol.png",
    "pathfinder": "02_pathfinder.png",
    "aegis": "03_aegis.png",
    "hermes": "04_hermes.png",
    "parking": "05_parking.png",
    "apple": "06_apple_robot.png",
    "rl": "07_rl_orchestration.png",
    "competition": "08_autonomous_competition.png",
    "ros2": "09_ros2_gazebo.png",
}

# Reference-board geometry measured at the supplied native dimensions.
# Values are [x, y, width, height].
TARGETS: dict[str, dict[str, Any]] = {
    "ggeolgeol": {
        "size": (971, 1619),
        "primary": (54, 421, 862, 303),
        "decision": (54, 756, 863, 123),
        "strategy": (54, 903, 863, 599),
        "tech": (54, 1522, 863, 60),
    },
    "pathfinder": {
        "size": (1024, 1536),
        "primary": (53, 461, 918, 386),
        "decision": (54, 872, 916, 109),
        "strategy": (54, 1009, 916, 391),
        "tech": (54, 1422, 916, 80),
    },
    "aegis": {
        "size": (1024, 1536),
        "primary": (55, 431, 915, 448),
        "decision": (54, 895, 916, 68),
        "strategy": (54, 980, 916, 411),
        "tech": (54, 1413, 916, 80),
    },
    "hermes": {
        "size": (971, 1619),
        "primary": (54, 430, 863, 351),
        "decision": (54, 813, 863, 116),
        "strategy": (54, 953, 863, 513),
        "tech": (54, 1488, 863, 80),
    },
    "parking": {
        "size": (1024, 1536),
        "primary": (58, 441, 908, 287),
        "decision": (54, 752, 916, 92),
        "strategy": (54, 867, 916, 530),
        "tech": (54, 1419, 916, 80),
    },
    "apple": {
        "size": (1024, 1536),
        "primary": (52, 437, 918, 329),
        "decision": (54, 781, 916, 106),
        "strategy": (54, 904, 916, 516),
        "tech": (54, 1442, 916, 60),
    },
    "rl": {
        "size": (1024, 1536),
        "primary": (46, 425, 932, 276),
        "decision": (54, 717, 916, 107),
        "strategy": (54, 849, 916, 562),
        "tech": (54, 1433, 916, 60),
    },
    "competition": {
        "size": (1024, 1536),
        "primary": (52, 413, 924, 351),
        "decision": (54, 784, 916, 95),
        "strategy": (54, 902, 916, 482),
        "tech": (54, 1406, 916, 80),
    },
    "ros2": {
        "size": (1024, 1536),
        "primary": (52, 417, 910, 387),
        "decision": (54, 821, 916, 106),
        "strategy": (54, 945, 916, 442),
        "tech": (54, 1409, 916, 80),
    },
}

SELECTORS = {
    "primary": ".project-primary",
    "decision": ".decision-banner",
    "strategy": ".strategy-section",
    "tech": ".tech-section",
}

BASELINE_GENES: dict[str, float] = {
    "paperPaddingX": 53.0,
    "paperPaddingY": 42.0,
    "titleSize": 44.0,
    "baseSize": 14.0,
    "moduleGap": 16.0,
    "sectionGap": 24.0,
    "cardRadius": 11.0,
    "watermarkSize": 94.0,
    "factGap": 28.0,
    "density": 1.0,
    "borderAlpha": 0.16,
}

UNIT_KEYS = {
    "paperPaddingX",
    "paperPaddingY",
    "titleSize",
    "baseSize",
    "moduleGap",
    "sectionGap",
    "cardRadius",
    "watermarkSize",
    "factGap",
}

CSS_VAR_MAP = {
    "paperPaddingX": "--paper-pad-x",
    "paperPaddingY": "--paper-pad-y",
    "titleSize": "--project-title-size",
    "baseSize": "--base-font-size",
    "moduleGap": "--module-gap",
    "sectionGap": "--section-gap",
    "cardRadius": "--card-radius",
    "watermarkSize": "--watermark-size",
    "factGap": "--fact-gap",
    "density": "--density",
    "borderAlpha": "--border-alpha",
}


@dataclass
class ServerHandle:
    process: subprocess.Popen[str] | None = None

    def close(self) -> None:
        if self.process and self.process.poll() is None:
            self.process.terminate()
            try:
                self.process.wait(timeout=4)
            except subprocess.TimeoutExpired:
                self.process.kill()


def _port_open(host: str = "127.0.0.1", port: int = 4173) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.25)
        return sock.connect_ex((host, port)) == 0


def ensure_server() -> ServerHandle:
    """Use an existing preview server or start the dependency-free Node server."""
    if _port_open():
        return ServerHandle()
    proc = subprocess.Popen(
        ["node", "server.mjs"],
        cwd=ROOT,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )
    deadline = time.time() + 12
    while time.time() < deadline:
        if _port_open():
            return ServerHandle(proc)
        if proc.poll() is not None:
            output = proc.stdout.read() if proc.stdout else ""
            raise RuntimeError(f"preview server exited early:\n{output}")
        time.sleep(0.15)
    proc.terminate()
    raise RuntimeError("preview server did not become ready on port 4173")


def chromium_executable() -> str | None:
    for candidate in ("/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome"):
        if Path(candidate).exists():
            return candidate
    return None


def css_genes(genes: dict[str, float]) -> dict[str, str | float]:
    output: dict[str, str | float] = {}
    for key, value in genes.items():
        output[key] = f"{value:.4f}px" if key in UNIT_KEYS else round(float(value), 6)
    return output


def encode_genes(genes: dict[str, float]) -> str:
    payload = json.dumps(css_genes(genes), ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    return base64.urlsafe_b64encode(payload).decode("ascii").rstrip("=")


def css_text(genes: dict[str, float], title: str = "GA-selected portfolio genes") -> str:
    lines = [f"/* {title}. Generated; edit the GA ranges rather than this file. */", ":root {"]
    formatted = css_genes(genes)
    for key, css_var in CSS_VAR_MAP.items():
        lines.append(f"  {css_var}: {formatted[key]};")
    lines.append("}")
    return "\n".join(lines) + "\n"


def image_from_png(png: bytes) -> Image.Image:
    return Image.open(io.BytesIO(png)).convert("RGB")


def _gray(image: Image.Image) -> np.ndarray:
    return cv2.cvtColor(np.asarray(image), cv2.COLOR_RGB2GRAY)


def image_ssim(reference: Image.Image, rendered: Image.Image, width: int, blur: float = 0.0) -> float:
    height = max(8, round(reference.height * width / reference.width))
    ref = reference.resize((width, height), Image.Resampling.LANCZOS)
    got = rendered.resize((width, height), Image.Resampling.LANCZOS)
    if blur > 0:
        ref = ref.filter(ImageFilter.GaussianBlur(blur))
        got = got.filter(ImageFilter.GaussianBlur(blur))
    return float(ssim(_gray(ref), _gray(got), data_range=255))


def box_score(actual: Iterable[float], target: Iterable[float], tolerance: tuple[float, float, float, float]) -> float:
    errors = [abs(float(a) - float(t)) / tol for a, t, tol in zip(actual, target, tolerance)]
    return float(max(0.0, 1.0 - np.mean(np.clip(errors, 0.0, 1.0))))


def geometry_score(layout: dict[str, Any], slug: str) -> tuple[float, dict[str, float]]:
    target = TARGETS[slug]
    components: dict[str, float] = {}
    height_error = abs(float(layout["pageHeight"]) - float(target["size"][1]))
    components["pageHeight"] = max(0.0, 1.0 - height_error / 20.0)
    for name in SELECTORS:
        # x/y are more visually important than a one-pixel border-size difference.
        components[name] = box_score(
            layout[name],
            target[name],
            (10.0, 10.0, 14.0, 14.0),
        )
    weights = {"pageHeight": 0.12, "primary": 0.30, "decision": 0.22, "strategy": 0.24, "tech": 0.12}
    total = sum(components[key] * weight for key, weight in weights.items())
    return float(total), components


def score_render(slug: str, screenshot: bytes, layout: dict[str, Any]) -> dict[str, Any]:
    target = TARGETS[slug]
    reference = Image.open(REFERENCE_DIR / REFERENCE_FILES[slug]).convert("RGB")
    rendered = image_from_png(screenshot)
    # The screenshot uses the reference viewport. Normalize defensively anyway.
    if rendered.size != reference.size:
        canvas = Image.new("RGB", reference.size, "white")
        resized = rendered.resize((reference.width, round(rendered.height * reference.width / rendered.width)), Image.Resampling.LANCZOS)
        canvas.paste(resized, (0, 0))
        rendered = canvas

    geometry, geometry_parts = geometry_score(layout, slug)
    x, y, w, h = target["primary"]
    hero_ref = reference.crop((x, y, x + w, y + h))
    hero_render = rendered.crop((x, y, x + w, y + h))
    hero = image_ssim(hero_ref, hero_render, width=160, blur=0.7)
    low_frequency = (
        0.45 * image_ssim(reference, rendered, width=128, blur=2.4)
        + 0.35 * image_ssim(reference, rendered, width=96, blur=2.0)
        + 0.20 * image_ssim(reference, rendered, width=64, blur=1.6)
    )
    raw_thumbnail = image_ssim(reference, rendered, width=256, blur=0.0)

    # Deliberately structure-heavy: major block geometry and the actual content
    # media dominate; system-font glyph rasterization remains visible in the
    # separate raw score rather than being disguised as layout failure.
    weighted = 0.60 * geometry + 0.25 * hero + 0.15 * low_frequency
    return {
        "weightedSimilarity": float(weighted),
        "geometry": float(geometry),
        "geometryParts": geometry_parts,
        "representativeMedia": float(hero),
        "lowFrequencySSIM": float(low_frequency),
        "rawThumbnailSSIM": float(raw_thumbnail),
        "pageHeight": float(layout["pageHeight"]),
    }


def collect_layout(page: Any) -> dict[str, Any]:
    output: dict[str, Any] = {"pageHeight": page.evaluate("document.documentElement.scrollHeight")}
    for name, selector in SELECTORS.items():
        box = page.locator(selector).first.bounding_box()
        if not box:
            raise RuntimeError(f"missing required selector: {selector}")
        output[name] = [box["x"], box["y"], box["width"], box["height"]]
    return output


def wait_for_images(page: Any) -> None:
    # Lazy images below a slightly over-tall mutated layout may never be
    # requested while the viewport stays at the top. Force eager loading and
    # cap the wait so one eccentric chromosome cannot hold the population
    # hostage. Nature has extinction; our QA loop has a timeout.
    page.evaluate(
        """async () => {
          const images = [...document.images];
          images.forEach(img => { img.loading = 'eager'; });
          window.scrollTo(0, document.documentElement.scrollHeight);
          const settled = Promise.all(images.map(img => img.complete ? Promise.resolve() : new Promise(resolve => {
            img.addEventListener('load', resolve, {once:true});
            img.addEventListener('error', resolve, {once:true});
          })));
          const timeout = new Promise(resolve => setTimeout(resolve, 1400));
          await Promise.race([settled, timeout]);
          await document.fonts?.ready;
          window.scrollTo(0, 0);
        }"""
    )


def render_project(page: Any, slug: str, genes: dict[str, float] | None = None, *, fast: bool = False) -> tuple[bytes, dict[str, Any]]:
    width, height = TARGETS[slug]["size"]
    page.set_viewport_size({"width": width, "height": height})
    params = f"preview={slug}"
    if genes is not None:
        params += f"&genes={encode_genes(genes)}"
    page.goto(f"{BASE_URL}/?{params}", wait_until="domcontentloaded", timeout=7000)
    if fast:
        page.evaluate("""() => {
          document.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
          window.scrollTo(0, document.documentElement.scrollHeight);
          window.scrollTo(0, 0);
        }""")
        page.wait_for_timeout(140)
    else:
        wait_for_images(page)
        page.wait_for_timeout(25)
    layout = collect_layout(page)
    screenshot = page.screenshot(full_page=False, animations="disabled")
    return screenshot, layout


def make_contact_sheet(entries: list[tuple[str, Path, Path]], destination: Path) -> None:
    """Create target/render/difference strips for quick human review."""
    rows: list[Image.Image] = []
    column_width = 300
    header_height = 28
    for slug, target_path, render_path in entries:
        target = Image.open(target_path).convert("RGB")
        render = Image.open(render_path).convert("RGB")
        target_small = target.resize((column_width, round(target.height * column_width / target.width)), Image.Resampling.LANCZOS)
        render_small = render.resize(target_small.size, Image.Resampling.LANCZOS)
        diff = ImageChops.difference(target_small, render_small)
        diff = ImageOps.autocontrast(diff, cutoff=1)
        row = Image.new("RGB", (column_width * 3 + 24, target_small.height + header_height), "white")
        row.paste(target_small, (0, header_height))
        row.paste(render_small, (column_width + 12, header_height))
        row.paste(diff, (column_width * 2 + 24, header_height))
        draw = ImageDraw.Draw(row)
        draw.text((2, 5), f"{slug} · reference", fill="black")
        draw.text((column_width + 14, 5), "render", fill="black")
        draw.text((column_width * 2 + 26, 5), "difference", fill="black")
        rows.append(row)
    canvas = Image.new("RGB", (rows[0].width, sum(row.height for row in rows) + 8 * (len(rows) - 1)), (232, 234, 238))
    y = 0
    for row in rows:
        canvas.paste(row, (0, y))
        y += row.height + 8
    destination.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(destination, quality=90)


def rounded_report(value: Any) -> Any:
    if isinstance(value, float):
        return round(value, 6)
    if isinstance(value, dict):
        return {key: rounded_report(val) for key, val in value.items()}
    if isinstance(value, list):
        return [rounded_report(val) for val in value]
    return value
