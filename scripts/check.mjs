import { readFile, stat, readdir } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";

const files = [
  "index.html",
  "work.html",
  "about.html",
  "writing.html",
  "post.html",
  "404.html",
];
for (const directory of ["work", "writing"]) {
  for (const name of await readdir(directory, { recursive: true }))
    if (name.endsWith(".html")) files.push(`${directory}/${name}`);
}
let checkedLinks = 0;
for (const file of files) {
  const html = await readFile(file, "utf8");
  assert.equal(
    (html.match(/<h1(?:\s|>)/g) || []).length,
    1,
    `${file}: one h1 required`,
  );
  assert.match(html, /<main id="main"[^>]*>/, `${file}: missing main landmark`);
  assert.match(html, /<title>.+<\/title>/, `${file}: missing title`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, new Set(ids).size, `${file}: duplicate IDs`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const href = match[1];
    if (/^(https?:|mailto:|data:)/.test(href)) continue;
    const url = new URL(href, `https://local.test/${file}`);
    let target = decodeURIComponent(url.pathname).slice(1) || "index.html";
    if (target.endsWith("/")) target += "index.html";
    assert.equal(
      (await stat(target).catch(() => null))?.isFile(),
      true,
      `${file}: missing local target ${href}`,
    );
    if (url.hash && target.endsWith(".html")) {
      const content = await readFile(target, "utf8");
      assert.ok(
        content.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
        `${file}: missing anchor ${href}`,
      );
    }
    checkedLinks++;
  }
  assert.ok(
    !html.includes("coming soon"),
    `${file}: placeholder leaked into public page`,
  );
}
const index = JSON.parse(await readFile("posts/index.json", "utf8"));
for (const post of index.posts.filter((p) => !p.public)) {
  assert.ok(
    !(await readFile("writing.html", "utf8")).includes(post.title),
    `Draft appears in writing list: ${post.slug}`,
  );
  assert.ok(
    !(await readFile("index.html", "utf8")).includes(post.title),
    `Draft appears on home: ${post.slug}`,
  );
}
assert.equal((await readFile("CNAME", "utf8")).trim(), "tamir.info");
console.log(
  `Checked ${files.length} pages and ${checkedLinks} local links/assets/anchors. Draft visibility and domain preserved.`,
);
