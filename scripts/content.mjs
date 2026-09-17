import { readFile, readdir } from "node:fs/promises";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const fields = new Set([
  "title",
  "summary",
  "date",
  "projects",
  "tags",
  "published",
]);

// A deliberately small YAML subset: `key: value`, `key: [a, b]`, and quoted
// strings. Anything else throws rather than guessing at the author's intent.
function unquote(raw, file, key) {
  const quoted = /^(['"])([\s\S]*)\1$/.exec(raw);
  const value = quoted ? quoted[2] : raw;
  if (!value) throw new Error(`${file}: empty value for ${key}`);
  return value;
}
function parseValue(raw, file, key) {
  if (raw.startsWith("[")) {
    if (!raw.endsWith("]"))
      throw new Error(`${file}: unterminated list for ${key}`);
    const inner = raw.slice(1, -1).trim();
    return inner
      ? inner.split(",").map((item) => unquote(item.trim(), file, key))
      : [];
  }
  if (raw === "true" || raw === "false") return raw === "true";
  return unquote(raw, file, key);
}
function parseFrontmatter(source, file) {
  const block = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!block) throw new Error(`${file}: missing frontmatter block`);
  const data = {};
  for (const line of block[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const colon = line.indexOf(":");
    if (colon < 1)
      throw new Error(`${file}: cannot parse frontmatter: ${line}`);
    const key = line.slice(0, colon).trim();
    if (!fields.has(key))
      throw new Error(`${file}: unknown frontmatter key: ${key}`);
    if (key in data)
      throw new Error(`${file}: duplicate frontmatter key: ${key}`);
    data[key] = parseValue(line.slice(colon + 1).trim(), file, key);
  }
  return { data, body: source.slice(block[0].length) };
}
function requireText(data, key, file) {
  if (typeof data[key] !== "string")
    throw new Error(`${file}: ${key} is required and must be text`);
  return data[key];
}
function requireList(data, key, file) {
  if (!(key in data)) return [];
  if (!Array.isArray(data[key]))
    throw new Error(
      `${file}: ${key} must be a list, for example ${key}: [a, b]`,
    );
  return data[key];
}

export async function loadWriting(site, directory = "content/writing") {
  const known = new Set(site.projects.map((project) => project.slug));
  const entries = [];
  for (const file of (await readdir(directory)).sort()) {
    if (!file.endsWith(".md")) continue;
    const slug = file.slice(0, -3);
    if (!slugPattern.test(slug))
      throw new Error(`Invalid writing slug: ${slug}`);
    const { data, body } = parseFrontmatter(
      await readFile(`${directory}/${file}`, "utf8"),
      file,
    );
    const date = requireText(data, "date", file);
    if (!datePattern.test(date) || Number.isNaN(Date.parse(date)))
      throw new Error(`${file}: date must be a real YYYY-MM-DD date`);
    const projects = requireList(data, "projects", file);
    for (const project of projects)
      if (!known.has(project))
        throw new Error(`${file}: unknown project: ${project}`);
    if ("published" in data && typeof data.published !== "boolean")
      throw new Error(`${file}: published must be true or false`);
    const published = data.published === true;
    if (
      published &&
      (/^\s*(coming soon[.!…]*|tbd|todo)\s*$/i.test(body) ||
        body.trim().length < 100)
    )
      throw new Error(`Refusing to publish unfinished writing: ${slug}`);
    entries.push({
      slug,
      title: requireText(data, "title", file),
      summary: requireText(data, "summary", file),
      date,
      projects,
      tags: requireList(data, "tags", file),
      published,
      url: `/writing/${slug}.html`,
      markdown: body,
    });
  }
  // Several notes share an authoring date, so slug breaks the tie and keeps
  // list order stable between builds.
  const newestFirst = (a, b) =>
    b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug);
  const writings = entries.filter((entry) => entry.published).sort(newestFirst);
  const byProject = new Map(site.projects.map((project) => [project.slug, []]));
  for (const writing of writings)
    for (const project of writing.projects)
      byProject.get(project).push(writing);
  return {
    writings,
    drafts: entries.filter((entry) => !entry.published).sort(newestFirst),
    byProject,
  };
}
