import {
  mkdtemp,
  cp,
  mkdir,
  readFile,
  writeFile,
  rm,
  stat,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { symlink } from "node:fs/promises";
import assert from "node:assert/strict";

// Exercise the publishing lifecycle in an isolated fixture, never in the author's posts.
const fixture = await mkdtemp(join(tmpdir(), "tamir-publishing-"));
try {
  await mkdir(join(fixture, "scripts"));
  await cp("scripts/build.mjs", join(fixture, "scripts/build.mjs"));
  await cp("scripts/art.mjs", join(fixture, "scripts/art.mjs"));
  await cp("content", join(fixture, "content"), { recursive: true });
  await mkdir(join(fixture, "posts"));
  await symlink(resolve("node_modules"), join(fixture, "node_modules"), "dir");
  const post = {
    slug: "test-note",
    title: "Test note",
    date: "2026-09-05",
    summary: "A publishing fixture.",
    public: false,
    featured: true,
    project: "inferrs",
  };
  const fixturePosts = [post];
  const save = () =>
    writeFile(
      join(fixture, "posts/index.json"),
      JSON.stringify({ posts: fixturePosts }),
    );
  const build = () =>
    execFileSync(process.execPath, [join(fixture, "scripts/build.mjs")], {
      stdio: "pipe",
    });
  await writeFile(join(fixture, "posts/test-note.md"), "Coming soon...");
  await save();
  build();
  assert.ok(
    !(await readFile(join(fixture, "index.html"), "utf8")).includes(post.title),
  );
  post.public = true;
  await save();
  assert.throws(build, (error) =>
    error.stderr.toString().includes("Refusing to publish unfinished writing"),
  );
  await writeFile(
    join(fixture, "posts/test-note.md"),
    "## A completed note\n\nThis is a test of the publishing workflow. A complete Markdown article should render as a standalone page and appear in the index. The content exists only in an isolated temporary fixture.",
  );
  build();
  assert.ok(
    (await readFile(join(fixture, "writing/test-note.html"), "utf8")).includes(
      "A completed note",
    ),
  );
  assert.ok(
    (await readFile(join(fixture, "index.html"), "utf8")).includes("Test note"),
  );
  for (const [slug, title, project] of [
    ["second-note", "Second note", "inferrs"],
    ["unrelated-note", "Unrelated note", "ledgerkv"],
  ]) {
    fixturePosts.push({ ...post, slug, title, project });
    await writeFile(
      join(fixture, `posts/${slug}.md`),
      "## Another note\n\nThis is another complete test article used to check project associations. It exists only inside the temporary publishing fixture and does not alter the real website.",
    );
  }
  await save();
  build();
  const hub = await readFile(join(fixture, "work/inferrs.html"), "utf8");
  assert.ok(hub.includes("Test note") && hub.includes("Second note"));
  assert.ok(!hub.includes("Unrelated note"));
  const sibling = await readFile(join(fixture, "work/ledgerkv.html"), "utf8");
  assert.ok(
    sibling.includes("Unrelated note") && !sibling.includes("Second note"),
  );
  post.public = false;
  await save();
  build();
  assert.equal(
    await stat(join(fixture, "writing/test-note.html")).catch(() => null),
    null,
  );
  assert.ok(
    !(await readFile(join(fixture, "sitemap.xml"), "utf8")).includes(
      "test-note",
    ),
  );
  console.log(
    "Publishing lifecycle passed: drafts hidden, placeholders rejected, complete articles rendered, unpublished output removed, multiple articles grouped by project.",
  );
} finally {
  await rm(fixture, { recursive: true, force: true });
}
