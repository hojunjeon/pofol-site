import { pages, projects, resumeProjects, routes, skillGroups } from "./data.js";

const app = document.querySelector("#app");
const query = new URLSearchParams(location.search);
const previewSlug = query.get("preview");

applyGeneOverrides();

function applyGeneOverrides() {
  const encoded = query.get("genes");
  if (!encoded) return;
  try {
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(normalized)));
    const genes = JSON.parse(json);
    const map = {
      paperPaddingX: "--paper-pad-x",
      paperPaddingY: "--paper-pad-y",
      titleSize: "--project-title-size",
      baseSize: "--base-font-size",
      moduleGap: "--module-gap",
      sectionGap: "--section-gap",
      cardRadius: "--card-radius",
      watermarkSize: "--watermark-size",
      factGap: "--fact-gap",
      density: "--density",
      borderAlpha: "--border-alpha",
    };
    Object.entries(map).forEach(([key, css]) => {
      if (genes[key] !== undefined) document.documentElement.style.setProperty(css, String(genes[key]));
    });
  } catch (error) {
    console.warn("GA gene parsing failed", error);
  }
}

function icon(name, className = "") {
  const common = `class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"`;
  const paths = {
    calendar: `<rect x="3.5" y="5.5" width="17" height="15" rx="2"/><path d="M7 3v5M17 3v5M3.5 10h17"/>`,
    team: `<path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16.5 10a2.5 2.5 0 1 0 0-5M2.5 20v-2.2A4.8 4.8 0 0 1 7.3 13h1.4a4.8 4.8 0 0 1 4.8 4.8V20M15 13h1.7a4.8 4.8 0 0 1 4.8 4.8V20"/>`,
    person: `<circle cx="12" cy="7" r="3.5"/><path d="M5 21v-3a7 7 0 0 1 14 0v3"/>`,
    flask: `<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3M8 15h8"/>`,
    context: `<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 7h4M19 5v4"/>`,
    flow: `<path d="M5 7h11a3 3 0 0 1 0 6H8a3 3 0 0 0 0 6h11M8 4 5 7l3 3M16 16l3 3-3 3"/>`,
    check: `<path d="m6 12 4 4 8-9"/>`,
    camera: `<path d="M4 7h3l1.5-2h7L17 7h3v12H4z"/><circle cx="12" cy="13" r="4"/>`,
    route: `<path d="M5 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm14 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM7 6h4a3 3 0 0 1 3 3v6a3 3 0 0 0 3 3"/>`,
    shield: `<path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>`,
    document: `<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 12h6M9 16h6"/>`,
    graph: `<circle cx="5" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="10" r="2"/><circle cx="15" cy="19" r="2"/><path d="m6.5 10.5 4-4M14 6l3.5 3M18 12l-2 5M13 18l-6-5"/>`,
    spark: `<path d="m12 2 1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>`,
    verify: `<rect x="4" y="3" width="16" height="18" rx="2"/><path d="m8 12 2.5 2.5L16 9M8 7h5"/>`,
    file: `<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>`,
    search: `<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/>`,
    target: `<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M22 12h-3"/>`,
    orchestrator: `<circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M12 7v5M5 16v-3h14v3"/>`,
    extract: `<rect x="4" y="3" width="12" height="15" rx="2"/><circle cx="16.5" cy="16.5" r="4"/><path d="m19.5 19.5 2 2M7 8h6M7 12h4"/>`,
    phone: `<path d="M7 3h4l1 5-2.5 1.5a15 15 0 0 0 5 5L16 12l5 1v4c0 2.2-1.8 4-4 4C9.3 21 3 14.7 3 7c0-2.2 1.8-4 4-4Z"/>`,
    dashboard: `<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 9v11M12 14h5M12 17h3"/>`,
    telegram: `<path d="m21 4-3 16-6-5-3 3-1-5-5-2z"/><path d="m8 13 10-6-7 8"/>`,
    kanban: `<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16M5.5 8h1M11.5 11h1M17.5 7h1"/>`,
    brain: `<path d="M9 5a3 3 0 0 0-5 2.2A3.5 3.5 0 0 0 5 14a3 3 0 0 0 4 4M15 5a3 3 0 0 1 5 2.2A3.5 3.5 0 0 1 19 14a3 3 0 0 1-4 4M12 4v16M8 8h4M12 13h4M8 17h4"/>`,
    notion: `<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 17V7l8 10V7"/>`,
    grid: `<path d="M4 4h16v16H4zM4 9h16M4 14h16M9 4v16M14 4v16"/>`,
    cube: `<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9"/>`,
    layers: `<path d="m12 3 9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5"/>`,
    image: `<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.5"/><path d="m5 18 5-5 3 3 2-2 4 4"/>`,
    bell: `<path d="M5 17h14l-2-3v-4a5 5 0 0 0-10 0v4zM10 20h4"/>`,
    split: `<path d="M6 4v5a3 3 0 0 0 3 3h6M6 20v-5a3 3 0 0 1 3-3M15 8l4 4-4 4"/>`,
    repeat: `<path d="M20 7V3l-2 2a8 8 0 1 0 2 9M4 17v4l2-2"/>`,
    warning: `<path d="M12 3 2.5 20h19zM12 9v5M12 17h.01"/>`,
    switch: `<path d="M4 7h13M14 4l3 3-3 3M20 17H7M10 14l-3 3 3 3"/>`,
    chart: `<path d="M4 20V4M4 20h16M7 16l3-4 3 2 4-7"/>`,
    play: `<path d="m8 5 11 7-11 7z"/>`,
    pencil: `<path d="m4 16-1 5 5-1L20 8l-4-4zM14 6l4 4"/>`,
    stop: `<rect x="5" y="5" width="14" height="14" rx="2"/>`,
    list: `<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>`,
    database: `<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>`,
    diamond: `<path d="m12 3 9 9-9 9-9-9z"/>`,
    sensors: `<path d="M5 7h4l1-2h4l1 2h4v10H5z"/><circle cx="12" cy="12" r="3"/><path d="M4 21h16M17 3c2 1 3 2 4 4"/>`,
    steering: `<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2"/><path d="M4 11h16M12 14v6M8 11l4 3 4-3"/>`,
    car: `<path d="M5 16v2M19 16v2M4 16h16l-1-6-3-3H8l-3 3zM7 16v2M17 16v2"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/>`,
    road: `<path d="M8 21 10 3M16 21 14 3M12 6v3M12 13v3"/>`,
    flag: `<path d="M5 21V4M5 5h10l-2 4 2 4H5"/>`,
    vision: `<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>`,
    convert: `<path d="M4 8h12M13 5l3 3-3 3M20 16H8M11 13l-3 3 3 3"/>`,
    clipboard: `<path d="M8 4h8v3H8z"/><rect x="5" y="6" width="14" height="15" rx="2"/><path d="m8 13 2 2 5-5"/>`,
    code: `<path d="m8 6-5 6 5 6M16 6l5 6-5 6M14 4l-4 16"/>`,
    link: `<path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1"/>`,
    clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>`,
    cloud: `<path d="M7 18h11a4 4 0 0 0 .5-8A6 6 0 0 0 7 8.5 4.7 4.7 0 0 0 7 18Z"/>`,
  };
  return `<svg ${common}>${paths[name] || paths.code}</svg>`;
}

function currentRouteKey(pathname = location.pathname) {
  if (pathname.startsWith("/resume")) return "resume";
  if (pathname.startsWith("/ai")) return "ai";
  if (pathname.startsWith("/robotics")) return "robotics";
  if (pathname.startsWith("/autonomous")) return "autonomous";
  return "home";
}

function siteHeader(current) {
  return `<header class="site-header">
    <a class="skip-link" href="#main">본문으로 건너뛰기</a>
    <div class="site-header-inner">
      <a class="brand" href="/" aria-label="전호준 포트폴리오 홈">JEON HOJUN</a>
      <nav class="desktop-nav" aria-label="주요 페이지">
        ${routes.map((route) => `<a href="${route.href}" ${current === route.key ? 'aria-current="page"' : ""}>${route.label}</a>`).join("")}
      </nav>
      <button class="mobile-menu-button" type="button" aria-expanded="false" aria-controls="mobile-menu">메뉴</button>
      <nav id="mobile-menu" class="mobile-nav" aria-label="모바일 페이지" hidden>
        ${routes.map((route) => `<a href="${route.href}" ${current === route.key ? 'aria-current="page"' : ""}>${route.label}</a>`).join("")}
      </nav>
    </div>
  </header>`;
}

function siteFooter(current) {
  return `<footer class="site-footer">
    <div class="site-footer-inner">
      <div><p class="footer-kicker">JEON HOJUN · PORTFOLIO</p><p>AI · Robotics · Autonomous Driving</p></div>
      <nav aria-label="페이지 하단 탐색">${routes.map((route) => `<a href="${route.href}" ${current === route.key ? 'aria-current="page"' : ""}>${route.label}</a>`).join("")}</nav>
    </div>
  </footer>`;
}

function techIcon(name) {
  const normalized = name.toLowerCase();
  if (normalized.includes("python")) return `<span class="brand-mark python">Py</span>`;
  if (normalized.includes("opencv")) return `<span class="brand-mark opencv">◉</span>`;
  if (normalized.includes("ros")) return `<span class="brand-mark ros">•••</span>`;
  if (normalized.includes("lidar")) return icon("database");
  if (normalized.includes("camera") || normalized.includes("realsense")) return icon("camera");
  if (normalized.includes("docker")) return `<span class="brand-mark docker">▰</span>`;
  if (normalized.includes("gazebo")) return icon("cube");
  if (normalized.includes("llm")) return icon("brain");
  if (normalized.includes("graph")) return icon("graph");
  if (normalized.includes("fastapi")) return `<span class="brand-mark fastapi">⚡</span>`;
  if (normalized.includes("vue")) return `<span class="brand-mark vue">V</span>`;
  if (normalized.includes("sql") || normalized.includes("dataset")) return icon("database");
  if (normalized.includes("telegram")) return icon("telegram");
  if (normalized.includes("notion")) return icon("notion");
  if (normalized.includes("kanban")) return icon("kanban");
  if (normalized.includes("arduino")) return `<span class="brand-mark arduino">∞</span>`;
  if (normalized.includes("raspberry")) return `<span class="brand-mark berry">●</span>`;
  if (normalized.includes("mujoco")) return `<span class="brand-mark mujoco">M</span>`;
  if (normalized.includes("rl")) return icon("brain");
  if (normalized.includes("checkpoint")) return icon("database");
  if (normalized.includes("test")) return icon("flask");
  if (normalized.includes("yolo") || normalized.includes("segformer")) return icon("cube");
  if (normalized.includes("control") || normalized.includes("pid") || normalized.includes("ackermann")) return icon("steering");
  if (normalized.includes("cloud")) return icon("cloud");
  if (normalized.includes("cron")) return icon("clock");
  if (normalized.includes("dashboard")) return icon("dashboard");
  return icon("code");
}

function renderTechStack(project) {
  return `<section class="tech-section" id="${project.slug}-tech" aria-labelledby="${project.slug}-tech-title">
    <h3 id="${project.slug}-tech-title">기술 스택</h3>
    <ul class="tech-row">${project.tech.map((item) => `<li>${techIcon(item)}<span>${item}</span></li>`).join("")}</ul>
  </section>`;
}

function renderDecision(project) {
  const pieces = [];
  let hasSub = false;
  for (const part of project.decision) {
    if (part.sub) {
      hasSub = true;
      pieces.push(`<span class="decision-sub">${part.text}</span>`);
    } else {
      pieces.push(`<span class="${part.accent ? `decision-accent ${part.accentTone || ""}` : ""}">${part.text}</span>`);
    }
  }
  return `<div class="decision-banner ${project.decisionDark ? "decision-banner-dark" : ""}">
    <span class="decision-check">${icon("check")}</span>
    <p class="${hasSub ? "has-sub" : ""}">${pieces.join(" ")}</p>
  </div>`;
}

function renderFacts(project) {
  return `<dl class="project-facts ${project.facts.length === 4 ? "facts-four" : ""}">
    ${project.facts.map((fact) => `<div><span class="fact-icon">${icon(fact.icon)}</span><dt>${fact.label}</dt><dd>${fact.value}</dd></div>`).join("")}
  </dl>`;
}

function renderToc(project) {
  return `<nav class="project-toc" aria-label="${project.title} 목차">
    <a class="active" href="#${project.slug}-overview">${icon("document")}<span>개요</span></a>
    <a href="#${project.slug}-context">${icon("context")}<span>사용 맥락</span></a>
    <a href="#${project.slug}-media">${icon("image")}<span>대표 이미지</span></a>
    <a href="#${project.slug}-strategy">${icon("split")}<span>전개 · 핵심 판단</span></a>
    <a href="#${project.slug}-tech">${icon("cube")}<span>기술 스택</span></a>
  </nav>`;
}

function renderPrimer(project) {
  const contextTone = project.primer.contextTone || "blue";
  const flowTone = project.primer.flowTone || "orange";
  return `<div class="primer-grid" id="${project.slug}-context">
    <article class="primer-card tone-${contextTone}"><span class="primer-icon">${icon("context")}</span><div><h3>사용 맥락</h3><p>${project.primer.context}</p></div></article>
    <article class="primer-card tone-${flowTone}"><span class="primer-icon">${icon("flow")}</span><div><h3>흐름</h3><p>${project.primer.flow}</p></div></article>
  </div>`;
}

function renderPrimary(project) {
  return `<figure class="project-primary" id="${project.slug}-media">
    <img src="${project.primary.src}" alt="${project.primary.alt}" loading="eager" decoding="async" />
    ${project.primary.caption ? `<figcaption>${project.primary.caption}</figcaption>` : ""}
  </figure>`;
}

function renderSectionLabel(text) {
  return `<p class="strategy-kicker">${text}</p>`;
}

function renderPipeline(items, { dark = false, compact = false, className = "" } = {}) {
  return `<div class="pipeline ${dark ? "pipeline-dark" : ""} ${compact ? "pipeline-compact" : ""} ${className}" role="img" aria-label="${items.map((item) => item[0]).join("에서 ")}">
    ${items.map((item, index) => {
      const [title, subtitle, iconName, imageSrc] = item;
      return `<div class="pipeline-unit-wrap">
        <article class="pipeline-unit ${imageSrc ? "has-image" : ""}">
          ${imageSrc ? `<img src="${imageSrc}" alt="" loading="lazy" decoding="async" />` : `<span class="pipeline-icon">${icon(iconName)}</span>`}
          <strong>${title}</strong>
          <span>${subtitle}</span>
        </article>
        ${index < items.length - 1 ? `<span class="pipeline-arrow" aria-hidden="true">${icon("convert")}</span>` : ""}
      </div>`;
    }).join("")}
  </div>`;
}

function renderDevelopmentStrategy(project) {
  const s = project.strategy;
  return `<section class="strategy-section strategy-development" id="${project.slug}-strategy" aria-labelledby="${project.slug}-strategy-title">
    <h3 class="strategy-title" id="${project.slug}-strategy-title">전개 · 핵심 판단</h3>
    <div class="development-grid">
      <article class="development-lead card-soft">
        <div class="label-icon">${icon("route")}</div>
        ${renderSectionLabel(s.lead.label)}
        <h4>${s.lead.title}</h4>
        <p>${s.lead.text}</p>
      </article>
      <article class="development-contract card-soft">
        <div>
          ${renderSectionLabel(s.contract.label)}
          <p>${s.contract.text}</p>
          <ol class="contract-steps">
            ${s.contract.steps.map(([label, value, iconName]) => `<li><span>${icon(iconName)}</span><small>${label}</small><strong>${value}</strong></li>`).join("")}
          </ol>
        </div>
        <div class="routing-artifact">
          ${renderSectionLabel(s.artifact.label)}
          <p>${s.artifact.text}</p>
          <div class="routing-symbol" aria-hidden="true"><span></span><span></span></div>
        </div>
      </article>
    </div>
    <ol class="mode-cards">
      ${s.modes.map((mode) => `<li class="mode-card ${mode.tone === "orange" ? "mode-card-orange" : ""}">
        <div class="mode-copy"><span class="number-badge">${mode.index}</span><div><h4>${mode.title}</h4><p>${mode.text}</p></div></div>
        <img src="${mode.src}" alt="${mode.title} 개념 장면" loading="lazy" decoding="async" />
      </li>`).join("")}
    </ol>
  </section>`;
}

function renderPathfinderStrategy(project) {
  const s = project.strategy;
  return `<section class="strategy-section strategy-reframe pathfinder-strategy" id="${project.slug}-strategy" aria-labelledby="${project.slug}-strategy-title">
    <h3 class="strategy-title" id="${project.slug}-strategy-title">전개 · 핵심 판단</h3>
    <div class="pathfinder-grid">
      ${[s.before, s.after].map((block, index) => `<article class="numbered-story card-soft">
        <div class="story-head"><span class="number-badge">${block.index}</span>${renderSectionLabel(block.label)}</div>
        <h4>${block.title}</h4>
        <p>${block.text}</p>
        <div class="${index === 0 ? "disconnected-visual" : "connected-visual"}" aria-hidden="true">
          ${index === 0
            ? `<div class="faint-network"></div><div class="loose-inputs"><span>공고</span><span>이력</span><span>자소서</span></div><div class="question-row"><b>?</b><b>?</b><b>?</b></div>`
            : `<div class="network-nodes">${Array.from({ length: 12 }, (_, i) => `<i style="--i:${i}"></i>`).join("")}</div>`}
        </div>
      </article>`).join("")}
      <article class="signature-card card-soft">
        <div class="story-head"><span class="number-badge">${s.artifact.index}</span>${renderSectionLabel(s.artifact.label)}</div>
        <p class="signature-caption">${s.artifact.title}</p>
        ${renderPipeline(s.artifact.flow, { compact: true, className: "pathfinder-pipeline" })}
        <div class="outcome-cards">
          ${s.artifact.outcomes.map(([title, text, iconName]) => `<article><span>${icon(iconName)}</span><h4>${title}</h4><p>${text}</p></article>`).join("")}
        </div>
      </article>
    </div>
  </section>`;
}

function renderAegisStrategy(project) {
  const s = project.strategy;
  return `<section class="strategy-section strategy-reframe aegis-strategy" id="${project.slug}-strategy" aria-labelledby="${project.slug}-strategy-title">
    <h3 class="strategy-title" id="${project.slug}-strategy-title">전개 · 핵심 판단</h3>
    <div class="before-after card-soft">
      <article class="before-state">
        ${renderSectionLabel(s.before.label)}
        <div class="state-icon">${icon("phone")}</div>
        <h4>${s.before.title}</h4>
        <p>${s.before.text}</p>
      </article>
      <span class="reframe-arrow" aria-hidden="true">→</span>
      <article class="after-state">
        ${renderSectionLabel(s.after.label)}
        <div class="state-icon">${icon("extract")}</div>
        <h4>${s.after.title}</h4>
        <p>${s.after.text}</p>
      </article>
    </div>
    <div class="role-cards">
      ${s.roles.map((role) => `<article class="role-card card-soft"><span class="role-icon">${icon(role.icon)}</span><div>${renderSectionLabel(role.label)}<h4>${role.title}</h4><p>${role.text}</p></div></article>`).join("")}
    </div>
    <article class="artifact-panel card-soft">
      <div class="artifact-heading"><span>${icon("flow")}</span><div>${renderSectionLabel("검토 가능한 위험정보 이벤트 생성 흐름")}<p>대화를 유지하면서 얻은 단서를 역할별로 추출·검증해 사람이 읽을 수 있는 JSON 이벤트로 남깁니다.</p></div></div>
      ${renderPipeline(s.flow, { compact: true, className: "aegis-pipeline" })}
    </article>
  </section>`;
}

function renderParkingStrategy(project) {
  const s = project.strategy;
  return `<section class="strategy-section strategy-reframe parking-strategy" id="${project.slug}-strategy" aria-labelledby="${project.slug}-strategy-title">
    <h3 class="strategy-title" id="${project.slug}-strategy-title">전개 · 핵심 판단</h3>
    <div class="parking-top">
      <article class="parking-symptom card-soft">
        <div class="label-icon">${icon("target")}</div>
        ${renderSectionLabel(s.symptom.label)}
        <h4>${s.symptom.title}</h4>
        <p>${s.symptom.text}</p>
      </article>
      <article class="parking-change card-soft">
        <div class="label-icon">${icon("split")}</div>
        ${renderSectionLabel(s.change.label)}
        <h4>${s.change.title}</h4>
        <div class="parallel-branches">
          ${s.change.branches.map(([label, title, text, iconName]) => `<article><span>${icon(iconName)}</span><small>${label}</small><strong>${title}</strong><p>${text}</p></article>`).join("")}
        </div>
      </article>
      <article class="parking-effects card-soft">
        <div class="label-icon">${icon("chart")}</div>
        ${renderSectionLabel("기대 효과")}
        <ul class="effect-list">${s.effects.map((effect) => `<li>${icon("check")}<span>${effect}</span></li>`).join("")}</ul>
      </article>
    </div>
    <article class="artifact-panel parking-artifact card-soft">
      <div class="artifact-heading"><span>${icon("layers")}</span><div>${renderSectionLabel("시그니처 아티팩트 · hybrid pipeline")}<p>영역과 객체를 병렬로 판단하고 우선순위 규칙으로 합쳐 최종 장면을 만듭니다.</p></div></div>
      ${renderPipeline(s.pipeline, { compact: true, className: "parking-pipeline" })}
    </article>
  </section>`;
}

function renderCompetitionStrategy(project) {
  const s = project.strategy;
  return `<section class="strategy-section strategy-reframe competition-strategy" id="${project.slug}-strategy" aria-labelledby="${project.slug}-strategy-title">
    <h3 class="strategy-title" id="${project.slug}-strategy-title">전개 · 핵심 판단</h3>
    <article class="competition-lead card-soft">
      <div class="label-icon">${icon("steering")}</div>
      <div>${renderSectionLabel(s.lead.label)}<h4>${s.lead.title}</h4><p>${s.lead.text}</p></div>
    </article>
    <div class="boundary-cards">
      ${s.boundary.map(([title, bullets, iconName], index) => `<article class="boundary-card card-soft"><span class="boundary-index">0${index + 1}</span><span class="boundary-icon">${icon(iconName)}</span><h4>${title}</h4><ul>${bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul></article>`).join("")}
    </div>
    <div class="mission-cards">
      ${s.missions.map(([title, text, iconName]) => `<article><span>${icon(iconName)}</span><h4>${title}</h4><p>${text}</p></article>`).join("")}
    </div>
    <article class="artifact-panel card-soft">
      <div class="artifact-heading"><span>${icon("convert")}</span><div>${renderSectionLabel("센서 인식에서 차량 구동까지")}<p>내 역할은 인식 결과를 차량이 실행할 수 있는 속도·조향 명령으로 바꾸는 제어 경계였습니다.</p></div></div>
      ${renderPipeline(s.pipeline, { compact: true, className: "competition-pipeline" })}
    </article>
  </section>`;
}

function renderReframeStrategy(project) {
  if (project.layout === "pathfinder") return renderPathfinderStrategy(project);
  if (project.layout === "aegis") return renderAegisStrategy(project);
  if (project.layout === "parking") return renderParkingStrategy(project);
  return renderCompetitionStrategy(project);
}

function renderHermesStrategy(project) {
  const s = project.strategy;
  return `<section class="strategy-section strategy-operations hermes-strategy" id="${project.slug}-strategy" aria-labelledby="${project.slug}-strategy-title">
    <h3 class="strategy-title" id="${project.slug}-strategy-title">전개 · 핵심 판단</h3>
    <div class="hermes-stage-grid">
      <article class="operations-lead dark-card"><span class="lead-bars" aria-hidden="true"><i></i><i></i><i></i></span>${renderSectionLabel(s.lead.label)}<h4>${s.lead.title}</h4></article>
      ${s.stages.map((stage) => `<article class="stage-card dark-card"><span class="number-badge">${stage.index}</span>${renderSectionLabel(stage.label)}<h4>${stage.title}</h4><p>${stage.text}</p></article>`).join("")}
    </div>
    <article class="dark-flow-panel">
      <div class="dark-panel-title"><span>${icon("document")}</span><strong>운영 계약</strong></div>
      ${renderPipeline(s.flow, { dark: true, compact: true, className: "hermes-pipeline" })}
    </article>
  </section>`;
}

function renderRlStrategy(project) {
  const s = project.strategy;
  return `<section class="strategy-section strategy-operations rl-strategy" id="${project.slug}-strategy" aria-labelledby="${project.slug}-strategy-title">
    <h3 class="strategy-title" id="${project.slug}-strategy-title">전개 · 핵심 판단</h3>
    <div class="rl-top-grid">
      <article class="rl-issue card-soft">
        ${renderSectionLabel(s.issue.label)}<h4>${s.issue.title}</h4>
        <dl class="diagnostic-rows">${s.issue.rows.map(([label, value, iconName]) => `<div><span>${icon(iconName)}</span><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl>
      </article>
      <article class="rl-roles card-soft">
        ${renderSectionLabel(s.roles.label)}<h4>${s.roles.title}</h4>
        <div class="orchestrator-node"><span>${icon("orchestrator")}</span><strong>Main Orchestrator</strong></div>
        <div class="role-rail">${s.roles.items.map(([label, value, iconName, tone]) => `<article class="tone-${tone}"><span>${icon(iconName)}</span><small>${label}</small><strong>${value}</strong></article>`).join("")}</div>
      </article>
    </div>
    <div class="state-gates">${s.gates.map(([title, text, iconName, tone]) => `<article class="gate-${tone}"><span>${icon(iconName)}</span><div><h4>${title}</h4><p>${text}</p></div></article>`).join("")}</div>
    <article class="dark-flow-panel rl-flow-panel">
      <div class="dark-panel-title"><span>${icon("repeat")}</span><strong>checkpoint 기반 실험 루프</strong></div>
      ${renderPipeline(s.flow, { dark: true, compact: true, className: "rl-pipeline" })}
    </article>
  </section>`;
}

function renderOperationsStrategy(project) {
  return project.layout === "hermes" ? renderHermesStrategy(project) : renderRlStrategy(project);
}

function appleVisual(type) {
  if (type === "curve") {
    return `<svg class="mini-diagram curve-diagram" viewBox="0 0 180 78" aria-hidden="true"><path d="M8 62C38 62 45 58 62 50S91 26 110 17s37-6 61-6"/><path d="M8 62h164"/><circle cx="155" cy="12" r="5"/><path class="target-line" d="M155 5v64"/></svg>`;
  }
  if (type === "loop") {
    return `<div class="mini-diagram loop-diagram" aria-hidden="true"><span>카메라</span><i>→</i><span>추론</span><i>→</i><span>제어</span><b>↺</b></div>`;
  }
  return `<div class="mini-diagram module-diagram" aria-hidden="true"><span>감지</span><i></i><span>제어</span><i></i><span>구동</span></div>`;
}

function renderAppleStrategy(project) {
  const s = project.strategy;
  return `<section class="strategy-section strategy-troubleshooting apple-strategy" id="${project.slug}-strategy" aria-labelledby="${project.slug}-strategy-title">
    <h3 class="strategy-title" id="${project.slug}-strategy-title">전개 · 핵심 판단</h3>
    <div class="apple-top-grid">
      <article class="apple-issue card-soft">
        ${renderSectionLabel(s.issue.label)}<h4>${s.issue.title}</h4><p>${s.issue.text}</p>
        <dl class="diagnostic-rows">${s.issue.rows.map(([label, value, iconName]) => `<div><span>${icon(iconName)}</span><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl>
      </article>
      <div class="apple-changes">
        ${s.changes.map((change) => `<article class="change-card card-soft"><span class="number-badge">${change.index}</span><div>${renderSectionLabel(change.label)}<p>${change.text}</p>${appleVisual(change.visual)}</div></article>`).join("")}
      </div>
    </div>
    <article class="scenario-panel card-soft">
      <div class="artifact-heading"><span>${icon("route")}</span><div>${renderSectionLabel("시그니처 아티팩트 · perception to action")}<p>과수원 인식부터 수확·분류까지 실제 제어 경계를 여섯 단계로 연결했습니다.</p></div></div>
      <ol class="scenario-strip">${s.scenarios.map(([index, title, src]) => `<li><div><span>${index}</span><strong>${title}</strong></div><img src="${src}" alt="${title} 장면" loading="lazy" decoding="async" /></li>`).join("")}</ol>
    </article>
  </section>`;
}

function renderRos2Architecture(s) {
  return `<article class="ros-architecture card-soft">
    <div class="artifact-heading"><span>${icon("graph")}</span><div>${renderSectionLabel("검증 가능한 ROS2 node architecture")}<p>센서 입력과 기능 노드를 namespace로 분리하고 Drive_Bot의 Ackermann 출력까지 한 방향으로 연결했습니다.</p></div></div>
    <div class="architecture-map">
      <div class="architecture-column sensor-column"><small>센서 입력</small>${s.architecture.sensors.map((item) => `<span>${icon(item === "Camera" ? "camera" : "sensors")}<b>${item}</b></span>`).join("")}</div>
      <span class="arch-arrow">→</span>
      <div class="architecture-column node-column"><small>기능별 node / namespace</small>${s.architecture.nodes.map((item) => `<span>${icon("cube")}<b>${item}</b></span>`).join("")}</div>
      <span class="arch-arrow">→</span>
      <div class="architecture-column output-column"><small>차량 출력</small>${s.architecture.output.map((item) => `<span>${icon("car")}<b>${item}</b></span>`).join("")}</div>
    </div>
    <div class="scenario-tags"><small>시나리오 단위 검증</small>${s.architecture.scenarios.map((item) => `<span>${icon("check")}${item}</span>`).join("")}</div>
  </article>`;
}

function renderRos2Strategy(project) {
  const s = project.strategy;
  return `<section class="strategy-section strategy-troubleshooting ros2-strategy" id="${project.slug}-strategy" aria-labelledby="${project.slug}-strategy-title">
    <h3 class="strategy-title" id="${project.slug}-strategy-title">전개 · 핵심 판단</h3>
    <article class="ros-lead card-soft"><div class="label-icon">${icon("clipboard")}</div><div>${renderSectionLabel(s.lead.label)}<h4>${s.lead.title}</h4><p>${s.lead.text}</p></div></article>
    <ol class="ros-steps">${s.steps.map(([index, title, text, iconName]) => `<li class="card-soft"><span class="number-badge">${index}</span><span class="step-icon">${icon(iconName)}</span><div><h4>${title}</h4><p>${text}</p></div></li>`).join("")}</ol>
    ${renderRos2Architecture(s)}
  </section>`;
}

function renderTroubleshootingStrategy(project) {
  return project.layout === "apple" ? renderAppleStrategy(project) : renderRos2Strategy(project);
}

function renderStrategy(project) {
  if (project.type === "development") return renderDevelopmentStrategy(project);
  if (project.type === "reframe") return renderReframeStrategy(project);
  if (project.type === "operations") return renderOperationsStrategy(project);
  return renderTroubleshootingStrategy(project);
}

function renderProjectDetail(project, { standalone = false } = {}) {
  return `<article class="project-paper ${standalone ? "project-standalone" : ""} project-${project.slug}" id="${project.slug}" data-project="${project.slug}" data-project-type="${project.type}">
    <header class="project-heading" id="${project.slug}-overview">
      <p class="project-eyebrow">${project.eyebrow}</p>
      <h2>${project.title}</h2>
      <p class="project-summary">${project.summary}</p>
      <span class="project-watermark" aria-hidden="true">${project.index}</span>
    </header>
    <div class="project-overview-grid">
      ${renderToc(project)}
      <div class="project-overview-main">
        ${renderFacts(project)}
        ${renderPrimer(project)}
      </div>
    </div>
    <div class="project-content">
      <h3 class="content-label">대표 이미지</h3>
      ${renderPrimary(project)}
      ${renderDecision(project)}
      ${renderStrategy(project)}
      ${renderTechStack(project)}
    </div>
  </article>`;
}

function overviewType(project) {
  const labels = {
    development: "개발 단계형",
    reframe: project.layout === "competition" ? "역할 경계형" : "문제 재정의형",
    operations: "운영 고도화형",
    troubleshooting: "트러블슈팅형",
  };
  return labels[project.type];
}

function pageHero(page) {
  const routeClass = page.key === "ai" ? "hero-blue" : page.key === "robotics" ? "hero-slate" : "hero-warm";
  return `<section class="route-hero ${routeClass}">
    <div class="route-hero-inner">
      <p class="eyebrow">${page.eyebrow}</p>
      <h1>${page.title}</h1>
      <p>${page.lede}</p>
      <a class="primary-button" href="#projects-overview">프로젝트 목록 보기 <span>↓</span></a>
    </div>
  </section>`;
}

function projectOverview(page) {
  return `<section class="project-index-section" id="projects-overview" aria-label="${page.key} 프로젝트 목록">
    <div class="project-index-list">
      ${page.projects.map((slug) => {
        const project = projects[slug];
        return `<article class="project-index-card"><span class="index-number">${project.index}</span><div><p>${overviewType(project)}</p><h2>${project.title}</h2></div><p class="index-message">${project.summary}</p><a href="#${project.slug}">보기 <span>↓</span></a></article>`;
      }).join("")}
    </div>
  </section>`;
}

function relatedLinks(current) {
  const links = routes.filter((route) => route.key !== "home" && route.key !== current);
  return `<section class="related-section"><div><p class="eyebrow">Related</p><h2>다른 프로젝트로 이어가기</h2><nav>${links.map((route) => `<a href="${route.href}">${route.label}<span>→</span></a>`).join("")}</nav></div></section>`;
}

function renderProjectPage(page) {
  return `<div class="site-shell domain-${page.key}">
    ${siteHeader(page.key)}
    <main id="main">
      ${pageHero(page)}
      ${projectOverview(page)}
      <div class="project-list">${page.projects.map((slug) => renderProjectDetail(projects[slug])).join("")}</div>
      ${relatedLinks(page.key)}
    </main>
    ${siteFooter(page.key)}
  </div>`;
}

function renderHome() {
  const cards = [
    ["/resume", "Resume", "문제 정의와 구현 경험을 한 문서로 정리한 이력서", "document"],
    ["/ai", "AI", "관계 연결·문제 재정의·운영 고도화로 설계한 AI 시스템", "brain"],
    ["/robotics", "Robotics", "인식·제어·실험을 실제 동작으로 이어 붙인 로봇 프로젝트", "orchestrator"],
    ["/autonomous-driving", "Autonomous Driving", "주행 모드·제어 경계·실행 환경을 나눈 자율주행 작업", "car"],
  ];
  return `<div class="site-shell home-shell">${siteHeader("home")}<main id="main" class="home-main">
    <section class="home-hero"><div class="home-copy"><p class="eyebrow">JEON HOJUN · PORTFOLIO</p><h1>AI·로보틱스·자율주행을 구현하는 신입 엔지니어, 전호준</h1><p>문제를 작게 나누고, 판단 경계를 설계하고, 실제 실행 흐름까지 연결한 프로젝트를 모았습니다.</p><div class="identity-line"><strong>전호준</strong><span>AI systems · Robotics · Autonomous driving</span></div><div class="home-actions"><a class="primary-button" href="/resume">이력서 보기 <span>→</span></a><a class="secondary-button" href="#work">프로젝트 탐색 <span>↓</span></a></div></div>
    <div class="home-portrait" aria-label="전호준 엔지니어 프로필을 상징하는 그래픽"><div class="portrait-grid"></div><span class="portrait-initial">JH</span><p>AI · Robotics · Autonomous</p></div></section>
    <section class="home-work" id="work"><p class="eyebrow">작업 트랙</p><div class="home-card-grid">${cards.map(([href, title, text, iconName]) => `<a href="${href}" class="home-card"><span>${icon(iconName)}</span><h2>${title}</h2><p>${text}</p><b>탐색하기 →</b></a>`).join("")}</div></section>
    </main>${siteFooter("home")}</div>`;
}

function renderResumeProject(project, index) {
  return `<article class="resume-project"><div class="resume-project-number">${String(index + 1).padStart(2, "0")}</div><div class="resume-project-copy"><p class="eyebrow">${project.domain.toUpperCase()}</p><h3>${project.title}</h3><strong>${project.decision.filter((part) => !part.sub).map((part) => part.text).join(" ")}</strong><p>${project.summary}</p><ul>${project.tech.slice(0, 6).map((item) => `<li>${item}</li>`).join("")}</ul><a href="/${project.domain === "autonomous" ? "autonomous-driving" : project.domain}#${project.slug}">상세 프로젝트 보기 <span>→</span></a></div><figure><img src="${project.primary.src}" alt="${project.primary.alt}" loading="lazy" decoding="async" /></figure></article>`;
}

function renderResume() {
  return `<div class="site-shell resume-shell">${siteHeader("resume")}<main id="main">
    <header class="resume-hero"><div><p class="eyebrow">RESUME · JEON HOJUN</p><h1>전호준</h1><p>AI 시스템·로보틱스·자율주행 프로젝트에서 문제를 나누고 구현과 검증이 이어지는 흐름을 설계했습니다.</p><ul><li>AI Systems</li><li>Robotics</li><li>Autonomous Driving</li></ul></div><address><p>Contact</p><a href="mailto:hoj0902@naver.com"><span>Email</span>hoj0902@naver.com</a><a href="tel:+821062893758"><span>Phone</span>010-6289-3758</a><a href="https://github.com/hojunjeon"><span>GitHub</span>github.com/hojunjeon</a></address></header>
    <section class="resume-section"><div class="resume-section-heading"><span>01</span><h2>Technical Skills</h2></div><div class="skill-grid">${skillGroups.map((group) => `<article><h3>${group.title}</h3><p>${group.scope}</p><small>Core</small><ul>${group.core.map((item) => `<li>${item}</li>`).join("")}</ul><small>Supporting</small><ul>${group.support.map((item) => `<li>${item}</li>`).join("")}</ul></article>`).join("")}</div></section>
    <section class="resume-section resume-project-section"><div class="resume-section-heading"><span>02</span><h2>Selected Projects</h2></div>${resumeProjects.map((slug, index) => renderResumeProject(projects[slug], index)).join("")}</section>
    <section class="resume-section timeline-section"><div class="resume-section-heading"><span>03</span><h2>Growth Timeline</h2></div><ol><li><time>2023–2024</time><strong>Edge AI 로봇</strong><p>인식·제어·임베디드 통합 경험을 쌓았습니다.</p></li><li><time>2024–2025</time><strong>자율주행 제어와 시뮬레이션</strong><p>센서 입력을 주행 명령으로 바꾸고 실행 환경을 분리했습니다.</p></li><li><time>2025–2026</time><strong>AI 시스템과 오케스트레이션</strong><p>관계 검색, 검증 루프, 역할·상태·기억 경계를 설계했습니다.</p></li></ol></section>
    </main>${siteFooter("resume")}</div>`;
}

function renderApp() {
  if (previewSlug && projects[previewSlug]) {
    document.body.classList.add("preview-mode");
    document.title = `${projects[previewSlug].title} · Preview`;
    app.innerHTML = renderProjectDetail(projects[previewSlug], { standalone: true });
  } else {
    document.body.classList.remove("preview-mode");
    const route = currentRouteKey();
    if (route === "home") app.innerHTML = renderHome();
    else if (route === "resume") app.innerHTML = renderResume();
    else app.innerHTML = renderProjectPage(pages[route]);
  }
  bindInteractions();
}

function bindInteractions() {
  const button = document.querySelector(".mobile-menu-button");
  const menu = document.querySelector("#mobile-menu");
  button?.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    menu.hidden = expanded;
  });

  const tocLinks = [...document.querySelectorAll(".project-toc a")];
  if (tocLinks.length && !previewSlug) {
    const sections = tocLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      tocLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`));
    }, { rootMargin: "-20% 0px -70%", threshold: [0, 0.15] });
    sections.forEach((section) => observer.observe(section));
  }

  const revealTargets = document.querySelectorAll(".project-paper:not(.project-standalone), .home-card, .resume-project");
  if ("IntersectionObserver" in window && !previewSlug) {
    const reveal = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        reveal.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    revealTargets.forEach((target) => reveal.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
  }
}

renderApp();
