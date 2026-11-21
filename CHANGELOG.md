# Changelog

All notable changes to the BetterRosales.org portal are documented in this file.

## [Unreleased]

### Fixed
- Fixed `.hotline-inner` wrapping `.hotline-carousel-viewport` onto a second row by adding `flex-wrap: nowrap !important` to `.hotline-inner` and `min-width: 0 !important` to `.hotline-carousel-viewport, .hotline-items` in `assets/css/ui-enhancements.css`.

### Added
- Added **Section 2: Transparency Dashboard** (`#transparency-dashboard`) to `index.html`, `assets/js/transparency-dashboard.js`, and `assets/css/ui-enhancements.css` featuring:
  - **Monthly Cost Trend** (Jan 2018 – Dec 2025 PhilGEPS SVG line/area chart, Q1/Q3 highlights, tracked entities).
  - **Top Awardees & Contractors** (horizontal bar chart & sector breakdown for Infrastructure, Medical/Lab, Fleet Maintenance, and Agricultural Support).
  - **DPWH • Infrastructure** (interactive Leaflet project map for 6th District Rosales projects with Bidding/In Progress/Completed status pins and budget allocations).
  - **Commission on Audit (COA) Reports** (accessible accordion summaries for Municipality of Rosales, Rosales Water District, and 37 Barangay Audits).
- Added **BetterGov Mission & Guiding Principles** section to `AGENTS.md` (citizen-first service access, accessibility/responsiveness, and multilingual/real-time civic utility per `docs.bettergov.ph/docs/about`).
- Added rule #3 (**Answer Concisely**) to `AGENTS.md` requiring brief, direct responses focused on outcomes, changed files, and verification.
- Added `AGENTS.md` with mandatory agent workflow rules: document all changes in `CHANGELOG.md`, keep technical docs/comments updated, always commit completed work using Conventional Commits, and preserve original non-LGU civic branding for BetterRosales.org.

### Removed
- Removed the **Popular Services** (`<!-- Quick Access Services -->`) section from `index.html`.

### Changed
- Updated `scripts/generate_rosales_logo.js` to also generate `favicon.svg` (both `assets/images/logo/` and `react-app/public/assets/images/logo/`) using the new BetterRosales geometric emblem, and regenerated multi-resolution `favicon.ico` (`16x16`, `32x32`, `48x48`).
- Moved the 5-card Quick Statistics Grid (`66,711` Residents, `37` Barangays, `1st Class` Income Class, `66.39 km²` Land area, and `1,004.8/km²` Pop. density with official sources) into `#about-rosales .about-rosales-highlights` in `index.html` and `assets/css/ui-enhancements.css`, and restored `.home-stats-v2` to its 4-column layout.
- Updated `.home-stats-v2` Quick Statistics Grid in `index.html` and `assets/css/ui-enhancements.css` to a 5-card responsive grid (`66,711` Residents, `37` Barangays, `1st Class` Income Class, `66.39 km²` Land area, and `1,004.8/km²` Pop. density) with official sources.
- Updated `index.html` SEO metadata (`<title>`, `description`, Open Graph, Twitter, and `geo.*` tags for Rosales, Pangasinan), Hero section headline/sub-headline/CTAs, and added Section 1 (`#about-rosales` — "The Crossroads of Heritage and Progress") with a split layout and 2x2 local highlight cards.
- Updated `assets/js/translations.js` English hero keys (`hero-welcome`, `hero-subtitle`, `hero-explore-town`, `hero-business-tourism`) and added `.about-rosales-section` styles in `assets/css/ui-enhancements.css`.
- Updated `ExchangeRateService.fetchRates()` in `assets/js/info-bar.js` to use `open.er-api.com/v6/latest/PHP` as the primary live FX endpoint (avoiding failed API-key requests to `exchangerate.host`) and switched `WeatherService` to reference `CONFIG.ROSALES_LAT` / `CONFIG.ROSALES_LON` directly.
- Redesigned the BetterRosales.org vector logo emblem in `scripts/generate_rosales_logo.js` as an original minimalist geometric civic mark (5-ray `#f2c91d` rising sun over two sweeping `#0032a0` valley/river ribbons), vertically centered and aligned beside the `Better Rosales .org` wordmark (`viewBox="0 0 421.6 151.7"`), with no resemblance to the official municipal seal.
- Regenerated all 8 standard and white-variant logo SVGs across `assets/images/logo/` and `react-app/public/assets/images/logo/`.

