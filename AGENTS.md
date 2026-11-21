# BetterRosales.org Agent Guidelines

## Mandatory Workflow Rules

1. **Document All Changes**
   - Every change made to the repository must be properly documented in `CHANGELOG.md` (under `[Unreleased]` or the current release section) with a clear summary of what changed and which files were affected.
   - Keep code comments, JSDoc/docstrings, and technical docs (`docs/`) accurate and up to date when modifying scripts, assets, or application behavior.

2. **Always Commit Changes**
   - Always commit completed, verified changes to Git before finishing a task.
   - Use Conventional Commits format matching the repository history:
     - `feat(scope): ...`
     - `fix(scope): ...`
     - `docs(scope): ...`
     - `chore(scope): ...`
   - Never leave uncommitted work behind after completing a request.

## Branding & Asset Conventions

- **Logo & Emblem**: The BetterRosales.org brand mark (`assets/images/logo/better-rosales-logo.svg` and `-white.svg`, plus legacy `better-solano-logo*.svg` aliases and `react-app/public/assets/images/logo/` copies) must remain an **original civic geometric emblem** and must **never** replicate or closely resemble the official Municipality of Rosales LGU seal.
- Regenerate all 8 logo SVG targets after any emblem/wordmark update by running:
  ```bash
  node scripts/generate_rosales_logo.js
  ```

