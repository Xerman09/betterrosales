---
name: civic-ui-ux
description: >-
  Civic UI/UX design standards for BetterRosales.org. Use whenever designing,
  improving, or reviewing pages, sections, cards, dashboards, or interactive components.
---

# Civic UI/UX Design Standards (BetterRosales.org)

Follow these principles on every UI and UX task to deliver clear, trustworthy, and modern civic interfaces without generic "AI slop":

1. **Purposeful Visual Hierarchy & Alignment**
   - Keep text, badges, icons, and actions consistently left-aligned inside cards (avoid floating centered badges over left-aligned titles).
   - Use crisp `1px solid #e2e8f0` hairline borders, restrained elevation, and `tabular-nums` for statistics, budgets, and phone numbers.
   - Never use raw emojis (`📊`, `👤`, `🚨`) in headings or UI chrome; always use Bootstrap Icons (`bi-*`) or clean vector SVGs.

2. **Asymmetric & Functional Layouts**
   - Avoid repetitive 2x2 grids of identical white boxes. Pair complementary content in asymmetric split panels (e.g., data controls/list on the left, interactive map or chart on the right).
   - Eliminate awkward empty voids inside stretched flex/grid cards by anchoring footer metadata (`margin-top: auto`) or compact coverage bars.

3. **Real Interactive Utility**
   - Make filters, toggles, and map pins genuinely interactive (e.g., clicking a project card pans the map; filtering updates both list and pins; phone numbers use `tel:` links).
   - Provide graceful fallbacks (e.g., clean SVG/monogram initials if an official portrait fails to load, OSM embed fallback if Leaflet tiles are blocked).

4. **Accessibility & Mobile Responsiveness**
   - Use semantic landmarks (`<article>`, `<section>`, `aria-label`, `role="list"`), sufficient color contrast (`>= 4.5:1`), and clean responsive stacking at `<= 960px` and `<= 600px`.
