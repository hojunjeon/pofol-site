# Portfolio site agent instructions

## Information architecture and naming

- The site has five pages: Main (메인페이지, `/`), Resume (`/resume`), AI (`/ai`), Robotics (`/robotics`), and Autonomous (`/autonomous-driving`).
- AI, Robotics, and Autonomous are the project pages (프로젝트 페이지).
- Each project page follows this top-level order: Header (헤더) → Table of contents (목차) → Project detail introduction (프로젝트 상세 소개).
- The project detail introduction follows this section order: Header (헤더) → Usage context / operation flow (사용 맥락/동작 흐름) → Representative image (대표 이미지) → Development · key decisions (전개 · 핵심 판단) → Technology stack (기술 스택).
- The Development · key decisions (전개 · 핵심 판단) section uses one of four types: Troubleshooting (트러블슈팅형), Problem redefinition (문제 재정의형), Operational improvement (운영 고도화형), or Development stage (개발 단계형).

## Site change rule

- Any user request that changes this site’s UI, content, interaction, assets, or deployment configuration includes the complete delivery flow: validate, commit, push, deploy, and verify. Do not stop at a local edit or a successful build unless the user explicitly requests local-only work.
- Before editing, inspect `git status --short --branch` and preserve unrelated user-owned changes. Before every Git mutation, verify the current branch with `git branch --show-current`; stage only the explicit files changed for this request, create a descriptive commit, and push the current branch to its configured upstream.
- Read `DESIGN.md` before visual work. Treat it as the source of truth for the Apple-inspired system: photography-led tiles, black/white/parchment surfaces, one Action Blue accent, SF-like system typography, pill actions, accessible focus states, responsive layouts, and no decorative gradients or UI shadows.
- After editing, run `npm run build`. Fix real build failures and rerun the build before deployment.
- After a successful build, commit and push the validated source, verify that local HEAD, the tracking ref, and the remote branch SHA match, then run `npm run deploy:oracle`. This repository’s production path is the Oracle/Nginx deployment handled by `scripts/deploy-oracle.ps1`; do not switch to Sites unless the user explicitly asks.
- The verified production SSH target is the `Oracle_tailscale` alias. Keep `scripts/deploy-oracle.ps1` pointed at this alias and use it for the production flow; do not silently fall back to the old `Oracle` alias.
- If unrelated dirty files, a missing upstream, authentication, or a branch/remote mismatch prevents a scoped commit or push, stop at `BLOCKED` after local validation and report the exact gate; do not stage broadly, force-push, reset, or bypass ownership.
- Verify the deployed URL and all five routes (`/`, `/resume`, `/ai`, `/robotics`, `/autonomous-driving`) after deployment. A build, upload, or HTTP 200 alone is not proof that the intended redesign is live; check a distinctive changed marker or visual/content signal as well.
- If Oracle credentials, SSH access, or the deployment target are unavailable, stop at `BLOCKED` after local validation and report the exact missing gate. Never claim deployment success from static or mock checks.

## Evidence and accessibility

- Preserve the evidence boundary in existing copy: distinguish personal role from team output and keep `UNVERIFIED`, local-only, PoC, and conceptual/generated labels intact.
- Keep keyboard navigation, visible focus, 44px touch targets, readable contrast, alt text, reduced-motion behavior, no horizontal overflow, and print behavior intact while redesigning.
- Use existing project assets first. Do not invent project metrics, hardware/runtime claims, or provenance.

## Verification

- `Oracle_tailscale` was verified as the working production path on 2026-08-14: `npm run deploy:oracle` completed the Nginx syntax check/reload, and all five public routes returned HTTP 200 with route-specific redesign markers.
- Use the real React/vinext source under `app/` and `public/`; do not recreate the removed legacy `static-portfolio/` artifact.
- Check the rendered pages at desktop, tablet, and narrow mobile widths before reporting completion when visual work is requested.
- Keep deployment credentials out of source, logs, remote URLs, and commits.
