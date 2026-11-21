# BetterRosales.org Agent Guidelines

## BetterGov Mission & Guiding Principles

BetterRosales.org is part of the **BetterGov.ph** civic initiative (`https://docs.bettergov.ph/docs/about`) to modernize and streamline citizen access to Philippine government services. Always prioritize:

- **Citizen-First Service Access**: Make municipal services, transparency data, government structure/officials, and news easy to find, search, and filter in one place.
- **Accessibility & Responsiveness**: Ensure every UI change is accessible, mobile-responsive across all device sizes, and fast-loading.
- **Multilingual & Real-Time Utility**: Maintain consistency across supported languages (English, Filipino, Ilocano) and keep real-time civic widgets (weather, forex, PHT, emergency hotlines) accurate and reliable.

## Mandatory Workflow Rules

1. **Document All Changes**
   - Every change made to the repository must be properly documented in `CHANGELOG.md` (under `[Unreleased]` or the current release section) with a clear summary of what changed and which files were affected.
   - Every commit must also be logged in `docs/rollout/MUNICIPALITY_ROLLOUT_LOG.md` (with commit hash, summary, what was added/changed, and what to update for other municipalities) so it serves as a replication guide.
   - Keep code comments, JSDoc/docstrings, and technical docs (`docs/`) accurate and up to date when modifying scripts, assets, or application behavior.

2. **Always Commit Changes**
   - Always commit completed, verified changes to Git before finishing a task.
   - Use Conventional Commits format matching the repository history:
     - `feat(scope): ...`
     - `fix(scope): ...`
     - `docs(scope): ...`
     - `chore(scope): ...`
   - Never leave uncommitted work behind after completing a request.

3. **Answer Concisely**
   - Keep responses brief, direct, and focused on key outcomes, changed files, and verification results without unnecessary filler.

4. **Only Use Real, Verified Data (No Fabricated Placeholders)**
   - Never invent or fabricate statistics, contract amounts, budget allocations, chart data points, project statuses, phone numbers, email addresses, or placeholder portraits.
   - Only display figures, entities, and contacts backed by verified public sources (e.g., PSA Census 2020, DILG/COMELEC, DOF, MPDC, Rosales.gov.ph, live Open-Meteo/FX APIs).
   - When granular or live data (e.g., PhilGEPS contract totals, DPWH project allocations) is not connected to a verified dataset or API, present qualitative summaries and direct links to the official source portals instead of synthetic numbers or dummy charts.

## UI/UX Craft & Design Standards

Follow the workspace skill `.agents/skills/civic-ui-ux/SKILL.md` on all UI/UX work:
- **Consistent Alignment & Hierarchy**: Left-align badges, titles, and metadata inside cards; use `1px solid #e2e8f0` hairline borders, `tabular-nums` for numbers, and Bootstrap Icons (`bi-*`) instead of raw emojis.
- **Functional Split Layouts**: Prefer interactive split panels (controls/list + map/chart) over repetitive static grids, and include graceful fallbacks for images and maps.

## Branding & Asset Conventions

- **Logo & Emblem**: The BetterRosales.org brand mark (`assets/images/logo/better-rosales-logo.svg` and `-white.svg`, plus legacy `better-solano-logo*.svg` aliases and `react-app/public/assets/images/logo/` copies) must remain an **original civic geometric emblem** and must **never** replicate or closely resemble the official Municipality of Rosales LGU seal.
- Regenerate all 8 logo SVG targets after any emblem/wordmark update by running:
  ```bash
  node scripts/generate_rosales_logo.js
  ```

