# Production content and visual cleanup

**Goal:** Hide unfinished material, remove public editorial notes, and make the existing design more restrained.

**Architecture:** Keep the current static Next.js export and Cloudflare Pages deployment. Published article exports exclude explicit drafts. Unfinished project data stays in source; the route and its navigation entries are removed until the material is ready.

**Constraints:** Preserve Hebrew RTL, existing brand colors, photos, forms, reviews, certificates and accessibility. Do not invent client facts, legal figures, retention periods, physical accessibility arrangements or coordinator appointments. No new dependencies.

## Tasks

- [x] Add and first run a production export check for internal notes, hidden routes, sitemap entries and broken internal links.
- [x] Remove the projects route/navigation/sitemap entry; mark two incomplete articles as drafts and remove their timeline links.
- [x] Remove unfinished public legal and FAQ copy using the established office contact details; keep unresolved facts in DECISIONS.md only.
- [x] Simplify decorative hero effects, card hover motion/shadows, icon badges, button motion and animated counters using existing styles.
- [ ] Build, run the production check, inspect desktop/mobile pages, review changes, then release through the existing GitHub/Cloudflare flow and verify production.

## Review focus

- Direct URLs for hidden pages must return 404, with no exposed draft text.
- Every remaining internal link and sitemap URL must resolve in the static export.
- Scan JSON-LD and serialized content as well as visible HTML for internal notes.
- Preserve keyboard focus, RTL layout and usable mobile forms.
- Keep static statistics visible before JavaScript and preserve the live reviews hook.
