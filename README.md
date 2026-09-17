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

| Change                                                 | Source                              |
| ------------------------------------------------------ | ----------------------------------- |
| Project order, summaries, links, work history, contact | `content/site.json`                 |
| Project overviews                                      | `content/overviews/<slug>.md`       |
| Shared page structure and About copy                   | `scripts/build.mjs`                 |
| Original SVG diagrams                                  | `scripts/art.mjs`                   |
| Visual system and responsive layouts                   | `css/style.css`, `css/diagrams.css` |
| Theme and diagram interactions                         | `js/theme.js`, `js/main.js`         |
| Résumé                                                 | `media/resume.pdf`                  |
| Writing                                                | `content/writing/<slug>.md`         |

After editing sources, run `npm run build`. Commit both sources and generated HTML; GitHub Pages can serve the repository root directly. `CNAME` remains `tamir.info`. No deployment changes are required.

The root HTML pages, `work/*.html`, `writing/*.html`, `sitemap.xml`, and `robots.txt` are generated. Edit their sources instead of the output. JavaScript enhances themes and the inference illustration; reading and navigation work without it.

## Publish writing

Every piece of writing is one Markdown file in `content/writing/`. The filename is the slug, so `content/writing/ledgerkv-replication-paths.md` is served at `/writing/ledgerkv-replication-paths.html`.

1. Create the file with YAML frontmatter, then write the body below it.

   ```markdown
   ---
   title: Two replication paths and a consistency check
   summary: Raft and quorum replication on the same storage engine.
   date: 2026-09-05
   projects: [ledgerkv]
   tags: [distributed-systems, java]
   published: true
   ---

   ## The shared storage engine
   ```

2. Run `npm run build` and preview it.
3. Run the checks before committing.

| Field       | Required | Meaning                                                             |
| ----------- | -------- | ------------------------------------------------------------------- |
| `title`     | yes      | Heading, page title, and list entry.                                |
| `summary`   | yes      | List entries and the `description` meta tag.                        |
| `date`      | yes      | `YYYY-MM-DD`. Sorts every list; ties break by slug.                 |
| `projects`  | no       | Project slugs from `content/site.json`. Zero, one, or several.      |
| `tags`      | no       | Free-form topics. Not validated and not yet rendered.               |
| `published` | no       | Defaults to `false`. Writing is only published when this is `true`. |

A writing appears in the collection of every project it lists, so a piece spanning two projects is shown under both. A project with no writing yet renders an honest empty state rather than a missing section. Project pages are still `work/<slug>.html`; writing no longer lives underneath them.

The frontmatter parser accepts `key: value`, `key: [a, b]`, and quoted strings, and nothing else. It rejects unknown keys, malformed dates, project slugs that do not exist, and bodies short enough to be placeholders. Anything it cannot parse fails the build instead of being guessed at, so multi-line values are not supported — keep each field on one line.

A `published: false` flag means _unlisted_, not access-controlled: `content/writing/<slug>.md` in this static repository remains retrievable. Do not place confidential drafts here.

Old `post.html?slug=…` URLs redirect to a matching published writing; the build embeds the published slugs in `post.html`, so no request is made for them. Unpublished or invalid slugs show a useful fallback. Unpublishing removes the generated page at the next build, and stale files under `work/` and `writing/` are pruned on every build.

The existing `/admin.html` editor is retained as a local drafting/export utility. Its original browser-storage workflow and external editor dependencies are unchanged. Export Markdown into `content/writing/`, add frontmatter, then run the build. It is not a publishing backend.

## Verify

```sh
npm run build
npm run check
# In another terminal, keep npm run preview running:
npm test
```

`check` validates public local links, anchors, headings, and draft visibility, then exercises the content model and the publish/unpublish lifecycle in an isolated temporary fixture: project association, frontmatter validation, draft hiding, and removal of stale output. `test` runs Chromium layout, accessibility, theme, keyboard, legacy URL, reduced-motion, and JavaScript-disabled checks. Screenshots and a JSON report are written to the ignored `test-results/` directory.

The browser checks use installed Google Chrome on macOS when available. Elsewhere, run `npx playwright install chromium`. You can set `CHROME_PATH` and `PREVIEW_URL` explicitly.

With the preview server running, `npm run social` regenerates the social preview image. Font and graphic attribution is in [docs/assets.md](docs/assets.md).

## Redesign record

- [Independent review of the original site](docs/review-before.md)
- [Independent review of the engineering-blog direction](docs/review-blog.md)
- [Earlier portfolio-design review, retained as history](docs/review-after.md)
- [Content provenance and editorial decisions](docs/content-provenance.md)
- [Validation record](docs/validation.md)
