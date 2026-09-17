import { readFile, writeFile, mkdir, readdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { marked } from "marked";
import { stackArt, projectArt, replicationModes } from "./art.mjs";
import { loadWriting } from "./content.mjs";

process.chdir(fileURLToPath(new URL("..", import.meta.url)));
const site = JSON.parse(await readFile("content/site.json", "utf8"));
const { writings, byProject } = await loadWriting(site);
const projectBySlug = new Map(
  site.projects.map((project) => [project.slug, project]),
);
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const projectURL = (project) => `/work/${project.slug}.html`;
const selected = site.projects.filter((project) => project.selected);
const pages = [];

function header(active) {
  return `<a class="skip-link" href="#main">Skip to content</a><header class="site-header wrap">
    <a class="wordmark" href="/" aria-label="Tamir Yirga, home">ty<span aria-hidden="true">.</span></a>
    <nav class="main-nav" aria-label="Main navigation"><a href="/writing.html" ${active === "writing" ? 'aria-current="page"' : ""}>Writing</a><a href="/about.html" ${active === "about" ? 'aria-current="page"' : ""}>About</a></nav>
    <button class="theme-toggle" type="button" aria-label="Switch to dark theme" hidden><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="7.5"/><path d="M12 4.5a7.5 7.5 0 0 1 0 15Z" fill="currentColor" stroke="none"/></svg></button>
  </header>`;
}
function footer() {
  return `<footer class="site-footer wrap" id="contact"><span>Tamir Yirga</span><nav aria-label="Elsewhere"><a href="mailto:${site.email}">Email</a><a href="${site.github}">GitHub</a><a href="${site.linkedin}">LinkedIn</a></nav></footer>`;
}
function layout({
  title,
  description,
  path,
  body,
  active = "",
  noindex = false,
}) {
  return `<!DOCTYPE html>
<html lang="en" id="top"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}</title><meta name="description" content="${escape(description)}"><meta name="theme-color" content="#f5f3ed"><link rel="canonical" href="https://tamir.info${path}">
${noindex ? '<meta name="robots" content="noindex">' : ""}
<meta property="og:type" content="website"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="https://tamir.info${path}"><meta property="og:image" content="https://tamir.info/media/social-card.png"><meta property="og:image:alt" content="Tamir Yirga | Engineering notes"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/media/favicon.svg" type="image/svg+xml"><link rel="preload" href="/media/type/instrument-sans-400-normal.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="/css/diagrams.css"><link rel="stylesheet" href="/css/style.css"><script src="/js/theme.js"></script><script src="/js/main.js" defer></script>
</head><body>${header(active)}<main id="main" tabindex="-1">${body}</main>${footer()}</body></html>\n`;
}
async function emit(path, options) {
  await writeFile(
    path,
    layout({
      ...options,
      path: path === "index.html" ? "/" : `/${path}`,
    }).replace(/[ \t]+$/gm, ""),
  );
  if (!options.noindex) pages.push(path === "index.html" ? "/" : `/${path}`);
}
function inferenceDiagram() {
  return `<div class="hero-diagram"><p class="diagram-heading">Inside InferRS</p>${stackArt()}<div class="diagram-controls" aria-label="Explore inference components" hidden><button type="button" data-step="load" aria-pressed="true">Load</button><button type="button" data-step="compute" aria-pressed="false">Compute</button><button type="button" data-step="sample" aria-pressed="false">Sample</button></div><p class="diagram-caption" aria-live="polite">Read model weights from a memory-mapped GGUF file.</p></div>`;
}
function replicationDiagram(overview = false) {
  return `<div class="replication-diagram visual-consensus${overview ? " overview-visual" : ""}">${projectArt("consensus")}<div class="replication-details"><div class="diagram-controls" role="group" aria-label="Compare LedgerKV replication modes" hidden>${Object.entries(
    replicationModes,
  )
    .map(
      ([mode, content]) =>
        `<button type="button" data-mode="${mode}" data-caption="${escape(content.caption)}" aria-pressed="${mode === "raft"}">${content.label}</button>`,
    )
    .join(
      "",
    )}</div><p class="diagram-caption" aria-live="polite">${replicationModes.raft.caption}</p></div></div>`;
}
function projectLinks(writing) {
  return writing.projects
    .map((slug) => projectBySlug.get(slug))
    .map(
      (project) =>
        `<a href="${projectURL(project)}">${escape(project.name)}</a>`,
    )
    .join(", ");
}
function projectRow(project) {
  const writing = byProject.get(project.slug);
  return `<article class="project-row"><div class="project-copy"><h2><a href="${projectURL(project)}">${escape(project.name)}<span class="project-subtitle">${escape(project.title)}</span></a></h2><p class="project-description">${escape(project.description)}</p>${
    writing.length
      ? `<div class="project-reading"><a class="reading-label" href="${projectURL(project)}#writing">Writing (${writing.length})</a><ul>${writing
          .slice(0, 3)
          .map(
            (item) =>
              `<li><a href="${item.url}">${escape(item.title)} <span aria-hidden="true">→</span></a></li>`,
          )
          .join(
            "",
          )}</ul>${writing.length > 3 ? `<a class="all-notes" href="${projectURL(project)}#writing">All writing</a>` : ""}</div>`
      : ""
  }</div>${project.slug === "inferrs" ? inferenceDiagram() : project.art === "consensus" ? replicationDiagram() : `<a class="project-visual visual-${project.art}" href="${projectURL(project)}" aria-label="Read about ${escape(project.name)}">${projectArt(project.art)}</a>`}</article>`;
}
function archiveRows(projects) {
  return `<div class="archive-list">${projects.map((project) => `<a class="archive-row" href="${projectURL(project)}"><div><h2>${escape(project.name)}</h2><p>${escape(project.title)}</p></div><span aria-hidden="true">→</span></a>`).join("")}</div>`;
}
function articleRows(articles, showProjects = true) {
  return `<div class="notes-list">${articles.map((article) => `<article class="note-row">${showProjects && article.projects.length ? `<p class="note-project">${projectLinks(article)}</p>` : ""}<h3><a href="${article.url}">${escape(article.title)}</a></h3><p>${escape(article.summary)}</p><time datetime="${escape(article.date)}">${escape(article.date)}</time></article>`).join("")}</div>`;
}

await emit("index.html", {
  title: "Tamir Yirga | Engineering Notes",
  description:
    "Engineering notes on inference engines, distributed systems, and the code behind them.",
  body: `<section class="introduction wrap"><h1>Tamir Yirga</h1><p>Notes on the software I’m building.<br> Mostly inference engines, data systems, and the pieces underneath.</p></section>
  <section class="wrap projects-section" id="projects">${selected.map(projectRow).join("")}<div class="other-projects">${archiveRows(site.projects.filter((project) => !project.selected))}</div></section>`,
});
await emit("work.html", {
  title: "Work | Tamir Yirga",
  description:
    "Inference, distributed storage, data pipelines, and computer vision. Overviews and related writing.",
  active: "projects",
  body: `<header class="page-intro wrap"><h1>Work</h1><p>What I’m building, how it works, and notes along the way.</p></header><section class="wrap projects-section" aria-label="Work">${selected.map(projectRow).join("")}<div class="other-projects">${archiveRows(site.projects.filter((project) => !project.selected))}</div></section>`,
});
await mkdir("work", { recursive: true });
for (const project of site.projects) {
  const overview = await readFile(
    `content/overviews/${project.slug}.md`,
    "utf8",
  );
  const writing = byProject.get(project.slug);
  await emit(`work/${project.slug}.html`, {
    title: `${project.name} | ${project.title}`,
    description: project.description,
    active: "projects",
    body: `<div class="wrap"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="/work.html">Work</a><span aria-hidden="true">/</span><span>${escape(project.name)}</span></nav><header class="project-intro"><h1>${escape(project.name)}</h1><p class="project-deck">${escape(project.title)}</p><div class="project-links">${project.repo ? `<a href="${project.repo}">Source on GitHub <span aria-hidden="true">↗</span></a>` : "<span>Private repository</span>"}${project.demo ? `<a href="${project.demo}">Demo video <span aria-hidden="true">↗</span></a>` : ""}<span>${escape(project.stack)}</span></div></header>
    <div class="project-overview"><article class="prose">${marked.parse(overview)}</article>${project.art === "consensus" ? replicationDiagram(true) : project.art ? `<figure class="overview-visual visual-${project.art}">${projectArt(project.art)}</figure>` : ""}</div>
    <section class="project-notes" id="writing"><h2>Writing</h2>${writing.length ? articleRows(writing, false) : `<p class="notes-empty">Nothing written about ${escape(project.name)} yet.</p>`}</section></div>`,
  });
}
// Remove project pages and directories left behind by earlier builds.
for (const entry of await readdir("work", { withFileTypes: true }))
  if (
    !entry.isFile() ||
    !site.projects.some((project) => `${project.slug}.html` === entry.name)
  )
    await rm(`work/${entry.name}`, { recursive: true, force: true });
function experienceRows() {
  return `<div class="experience-list">${site.experience.map((experience) => `<article class="experience-row"><p class="experience-date">${escape(experience.date)}</p><div><h3><a href="${experience.url}">${escape(experience.company)}</a></h3><p class="experience-role">${escape(experience.role)}</p><p>${escape(experience.description)}</p></div></article>`).join("")}</div>`;
}
await emit("about.html", {
  title: "About | Tamir Yirga",
  description: "A little background on Tamir Yirga and this engineering blog.",
  active: "about",
  body: `<header class="page-intro wrap about-intro"><div><h1>About</h1></div><img src="/media/profile.jpeg" width="112" height="112" alt="Colored-pencil illustration of Tamir Yirga" class="about-portrait"></header>
  <section class="wrap about-copy prose" aria-label="About me"><p>I’m Tamir, a software engineer based in Seattle. This is where I write about the software I’m building.</p><p>My work started with web applications and e-commerce platforms, then moved toward query execution, data pipelines, and distributed storage. More recently I’ve been writing Rust and working on an inference engine.</p><p>I’m pursuing an MS in Computer Science at Northeastern, with graduation expected in December 2026. I’ve also worked as a research assistant on LLM evaluation and a teaching assistant in distributed systems, cloud computing, and computer vision.</p><p>You can find my code on <a href="${site.github}">GitHub</a>, or reach me by <a href="mailto:${site.email}">email</a>.</p></section>
  <section class="wrap background-section" id="experience"><div class="section-heading"><h2>Background</h2><a href="/media/resume.pdf">Résumé <span class="file-type">PDF</span></a></div>${experienceRows()}</section>
  <section class="wrap credentials-section"><details><summary>Education & credentials</summary><div class="prose"><p>Northeastern University · MS Computer Science, expected December 2026 · GPA 4.0 / 4.0.</p><ul><li><a href="https://www.credly.com/badges/ef7be6b9-2aba-428d-9e40-adb1bdd224f6/public_url">Google Cloud Professional Cloud Architect</a> · 2026</li><li><a href="https://certification.adobe.com/credential/verify/ae363d83-b0ca-11ef-8f8b-42010a40001c">Adobe Commerce Developer: Expert</a> · 2024</li><li><a href="https://certification.adobe.com/credential/verify/ae8a348e-b0ca-11ef-8f8b-42010a40001c">Adobe Commerce Developer: Professional</a> · 2023</li><li><a href="https://www.credly.com/badges/a0ad5ed0-b452-491f-b987-6294fa18d485">Azure Fundamentals</a> · 2021</li><li><a href="https://www.credly.com/badges/300c98dc-f894-4379-b0df-9a2d4405e937">Azure AI Engineer Associate</a> · Earned 2021, expired 2023</li></ul></div></details></section>`,
});
await mkdir("writing", { recursive: true });
for (const file of await readdir("writing"))
  if (
    file.endsWith(".html") &&
    !writings.some((writing) => `${writing.slug}.html` === file)
  )
    await rm(`writing/${file}`);
for (const writing of writings) {
  await emit(`writing/${writing.slug}.html`, {
    title: `${writing.title} | Tamir Yirga`,
    description: writing.summary,
    active: "writing",
    body: `<div class="wrap"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="/writing.html">Writing</a></nav><header class="article-intro">${writing.projects.length ? `<p class="article-project">${projectLinks(writing)}</p>` : ""}<time datetime="${escape(writing.date)}">${escape(writing.date)}</time><h1>${escape(writing.title)}</h1><p>${escape(writing.summary)}</p></header><article class="prose article-body">${marked.parse(writing.markdown)}</article><div class="article-return">${
      writing.projects.length
        ? writing.projects
            .map((slug) => projectBySlug.get(slug))
            .map(
              (project) =>
                `<a href="${projectURL(project)}">More from ${escape(project.name)} <span aria-hidden="true">→</span></a>`,
            )
            .join("")
        : `<a href="/writing.html">All writing <span aria-hidden="true">→</span></a>`
    }</div></div>`,
  });
}
await emit("writing.html", {
  title: "Writing | Tamir Yirga",
  description:
    "Engineering notes on inference, distributed storage, data pipelines, and computer vision.",
  active: "writing",
  body: `<header class="page-intro wrap"><h1>Writing</h1><p>Notes on implementation, experiments, and things still in progress.</p></header><section class="wrap writing-index" aria-label="Notes and articles">${writings.length ? articleRows(writings) : `<p class="notes-empty">Nothing published yet.</p>`}</section>`,
});
await emit("post.html", {
  title: "Article unavailable | Tamir Yirga",
  description: "This article is not published. Browse the engineering notes.",
  noindex: true,
  body: `<section class="page-intro wrap"><h1>This article isn’t published.</h1><p>The old link pointed to an unfinished draft. <a href="/writing.html">Browse the published notes.</a></p></section><script type="application/json" id="published-writing">${JSON.stringify(writings.map((writing) => writing.slug))}</script><script src="/js/post.js" defer></script>`,
});
await emit("404.html", {
  title: "Page not found | Tamir Yirga",
  description: "This page does not exist.",
  noindex: true,
  body: `<section class="page-intro wrap"><h1>Page not found.</h1><p>This address doesn’t lead to a page. <a href="/">Back to the index.</a></p></section>`,
});
await writeFile(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((path) => `<url><loc>https://tamir.info${path}</loc></url>`).join("")}</urlset>\n`,
);
await writeFile(
  "robots.txt",
  "User-agent: *\nAllow: /\nDisallow: /admin.html\nSitemap: https://tamir.info/sitemap.xml\n",
);
console.log(
  `Built ${pages.length} indexed pages: ${site.projects.length} projects and ${writings.length} published writings.`,
);
