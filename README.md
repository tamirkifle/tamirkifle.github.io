# tamir.info

A small engineering blog organized around project collections. Each project has a short overview and a growing list of technical notes and articles. Employment details live on About. HTML is generated ahead of time. The public site has no framework, client-side router, analytics, or runtime CDN dependencies.

## Run locally

Requires Node 22 or newer.

```sh
npm ci
npm run dev
```

Open **http://localhost:4173**. The preview server binds to the local machine. To use another port, run `PORT=4175 npm run dev`.

Content and template changes need `npm run build`; CSS and JavaScript changes need a browser refresh. `npm run preview` serves the existing output without rebuilding.

## Edit the site

| Change                                                 | Source                                |
| ------------------------------------------------------ | ------------------------------------- |
| Project order, summaries, links, work history, contact | `content/site.json`                   |
| Project overviews                                      | `content/overviews/<slug>.md`         |
| Project notes                                          | `content/projects/<slug>.md`          |
| Shared page structure and About copy                   | `scripts/build.mjs`                   |
| Original SVG diagrams                                  | `scripts/art.mjs`                     |
| Visual system and responsive layouts                   | `css/style.css`, `css/diagrams.css`   |
| Theme and diagram interactions                         | `js/theme.js`, `js/main.js`           |
| Résumé                                                 | `media/resume.pdf`                    |
| Article metadata and bodies                            | `posts/index.json`, `posts/<slug>.md` |

After editing sources, run `npm run build`. Commit both sources and generated HTML; GitHub Pages can serve the repository root directly. `CNAME` remains `tamir.info`. No deployment changes are required.

The root HTML pages, `work/**/*.html`, `writing/*.html`, `sitemap.xml`, and `robots.txt` are generated. Edit their sources instead of the output. JavaScript enhances themes and the inference illustration; reading and navigation work without it.

## Publish writing

1. Write a complete article in `posts/<slug>.md`.
2. Add its title, summary, date, slug, and `public: true` to `posts/index.json`. Set `project` to a project slug (for example, `"project": "inferrs"`) to include it in that project’s collection. Multiple articles can share a project.
3. Run `npm run build` and preview it. Published articles get a static page, a writing-index entry, a sitemap entry, and an entry in their project collection when associated.
4. Run the checks before committing.

The six existing technical notes are served at `work/<project>/notes.html`; their short project overviews are at `work/<project>.html`. They are listed without invented publication dates.

The three original placeholder articles are retained with `public: false`. The build rejects obvious placeholder articles marked public. A `public: false` flag means _unlisted_, not access-controlled: files in this static repository remain retrievable. Do not place confidential drafts here.

Old `post.html?slug=…` URLs redirect to a matching published article. Unpublished or invalid slugs show a useful fallback. Unpublishing an article removes its generated page at the next build.

The existing `/admin.html` editor is retained as a local drafting/export utility. Its original browser-storage workflow and external editor dependencies are unchanged. Export Markdown and index metadata into `posts/`, then run the build. It is not a publishing backend.

## Verify

```sh
npm run build
npm run check
# In another terminal, keep npm run preview running:
npm test
```

`check` validates public local links, anchors, headings, draft visibility, and the publish/unpublish lifecycle in an isolated temporary fixture. `test` runs Chromium layout, accessibility, theme, keyboard, legacy URL, reduced-motion, and JavaScript-disabled checks. Screenshots and a JSON report are written to the ignored `test-results/` directory.

The browser checks use installed Google Chrome on macOS when available. Elsewhere, run `npx playwright install chromium`. You can set `CHROME_PATH` and `PREVIEW_URL` explicitly.

With the preview server running, `npm run social` regenerates the social preview image. Font and graphic attribution is in [docs/assets.md](docs/assets.md).

## Redesign record

- [Independent review of the original site](docs/review-before.md)
- [Independent review of the engineering-blog direction](docs/review-blog.md)
- [Earlier portfolio-design review, retained as history](docs/review-after.md)
- [Content provenance and editorial decisions](docs/content-provenance.md)
- [Validation record](docs/validation.md)
