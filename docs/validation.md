# Redesign validation

Validated locally on September 5, 2026, using Node 22 and headless Google Chrome on macOS. The built-in browser was unavailable; screenshots and browser checks used local Playwright with installed Chrome.

## Passed checks

- `npm run build`: 16 indexed pages, including 6 project notes; no published standalone articles.
- `npm run check`: 18 generated pages; 253 local link, asset, and anchor references; one main heading per page; domain preserved; draft titles absent from public lists.
- Isolated publishing lifecycle: draft hidden; a placeholder marked public rejected before output; complete article generated and listed; later unpublication removes its output and sitemap entry.
- `npm test`: 12 routes, 36 responsive combinations, 15 axe scans, and 10 interaction checks passed.
- Responsive widths: 360, 390, 560, 768, 1024, and 1440 pixels. No horizontal overflow in the tested homepage, project index, About, or project-detail layouts.
- Axe WCAG 2 A/AA and 2.1 AA scans: zero reported violations across the tested light, dark, and mobile states. Automated scans are not a claim of complete accessibility conformance.
- Theme changes persist on reload. All three hero controls update the active layer, accessible button state, and description.
- LedgerKV's Raft and quorum controls change the visible topology, accessible description, and caption on the homepage, index, and overview. Write and acknowledgement animations finish, replay, and cancel on rapid mode changes. Keyboard selection and reduced motion pass; the static Raft illustration remains readable without JavaScript.
- Quorum replays randomize response order and highlight three successful acknowledgements. A seeded 100-replay browser check exercises all ten possible three-of-five combinations, including combinations without the coordinator. Confirmed routes and accessible descriptions match the selected replicas, all replicas still receive the write, and consecutive replays differ. Mobile screenshots also cover partial acknowledgements and completed quorum states in both themes.
- Additional mobile checks cover switching replication modes and enabling reduced motion during an animation. Both modes were visually inspected, including a paused write in flight. The corrected ski-tracker connections and labels were inspected at desktop and mobile sizes in both themes.
- Keyboard skip link, reduced-motion scrolling, invalid/unpublished article fallback, and content/navigation with JavaScript disabled all passed.
- No browser page errors or failed public resource responses during the main checks.
- Legacy admin utility smoke check: loads, opens a new draft, and renders Markdown after its existing debounce. The test used an isolated browser context and did not export or publish anything.
- `git diff --check`: clean.

## Visual review and revised brief

The user clarified that this should be a minimalist engineering blog, not an employee or services pitch. The final revision removes role/location badges, primary calls to action, homepage employment history, and the large contact band. The illustrations remain with the projects.

Project names lead the entries. Each project has a short editorial overview, then a collection of notes and articles. Available note titles are also linked directly from the homepage. Multiple future articles can be associated with a project; the isolated publishing test verifies that unrelated articles do not leak into other collections.

The header uses the original `ty.` mark with Writing and About. Public navigation and headings no longer use “Projects”; titles and body copy no longer use em dashes. Names and descriptions occupy separate lines.

The independent reviewer assessed this new direction separately from the earlier portfolio design. Its current report is [review-blog.md](review-blog.md); the prior review is retained as history. Browser captures cover desktop and mobile project overviews and note pages, along with dark mode and the homepage.

See [the original review](review-before.md) and [the before/after comparison](previews/comparison.png). Reproducible full-page screenshots and the detailed test report are generated into `test-results/` by `npm test`.

## Limits

Safari, Firefox, real touch devices, and hosted production behavior were not tested. External destination URLs were retained from the original site and résumé; the automated link check covers local routes and assets. Project benchmark claims were edited from existing supplied material, not rerun. The résumé PDF was preserved unchanged.

No remote branch, issue, pull request, or deployment was created. The work is local.
