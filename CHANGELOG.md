# Changelog

All notable changes to the BetterRosales.org portal are documented in this file.

## [Unreleased]

### Fixed
- Fixed `.hotline-inner` wrapping `.hotline-carousel-viewport` onto a second row by adding `flex-wrap: nowrap !important` to `.hotline-inner` and `min-width: 0 !important` to `.hotline-carousel-viewport, .hotline-items` in `assets/css/ui-enhancements.css`.

### Added
- Added rule #3 (**Answer Concisely**) to `AGENTS.md` requiring brief, direct responses focused on outcomes, changed files, and verification.
- Added `AGENTS.md` with mandatory agent workflow rules: document all changes in `CHANGELOG.md`, keep technical docs/comments updated, always commit completed work using Conventional Commits, and preserve original non-LGU civic branding for BetterRosales.org.

### Changed
- Updated `ExchangeRateService.fetchRates()` in `assets/js/info-bar.js` to use `open.er-api.com/v6/latest/PHP` as the primary live FX endpoint (avoiding failed API-key requests to `exchangerate.host`) and switched `WeatherService` to reference `CONFIG.ROSALES_LAT` / `CONFIG.ROSALES_LON` directly.
- Redesigned the BetterRosales.org vector logo emblem in `scripts/generate_rosales_logo.js` as an original minimalist geometric civic mark (5-ray `#f2c91d` rising sun over two sweeping `#0032a0` valley/river ribbons), vertically centered and aligned beside the `Better Rosales .org` wordmark (`viewBox="0 0 421.6 151.7"`), with no resemblance to the official municipal seal.
- Regenerated all 8 standard and white-variant logo SVGs across `assets/images/logo/` and `react-app/public/assets/images/logo/`.

