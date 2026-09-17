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
import { loadWriting } from "./content.mjs";

// Exercise the content model and the publishing lifecycle in an isolated
// fixture, never against the author's own writing.
const fixture = await mkdtemp(join(tmpdir(), "tamir-publishing-"));
const site = JSON.parse(await readFile("content/site.json", "utf8"));
const writingDirectory = join(fixture, "content/writing");
const complete =
  "## A completed note\n\nThis is a test of the publishing workflow. A complete Markdown article should render as a standalone page and appear in the index. The content exists only in an isolated temporary fixture.";
const write = (slug, front, body = complete) =>
  writeFile(
    join(writingDirectory, `${slug}.md`),
    `---\n${front}\n---\n\n${body}\n`,
  );
const reset = async () => {
  await rm(writingDirectory, { recursive: true, force: true });
  await mkdir(writingDirectory, { recursive: true });
};
const load = () => loadWriting(site, writingDirectory);
const rejects = async (message) =>
  assert.rejects(load, (error) => error.message.includes(message));

try {
  await mkdir(join(fixture, "scripts"));
  for (const file of ["build.mjs", "art.mjs", "content.mjs"])
    await cp(`scripts/${file}`, join(fixture, `scripts/${file}`));
  await cp("content", join(fixture, "content"), { recursive: true });
  await symlink(resolve("node_modules"), join(fixture, "node_modules"), "dir");

  // The content model: association, drafts, and validation.
  await reset();
  await write(
    "shared-note",
    "title: Shared note\nsummary: Touches two projects.\ndate: 2026-09-10\nprojects: [inferrs, ledgerkv]\npublished: true",
  );
  await write(
    "inferrs-only",
    "title: InferRS only\nsummary: One project.\ndate: 2026-09-09\nprojects: [inferrs]\npublished: true",
  );
  await write(
    "unattached",
    "title: Unattached\nsummary: No project at all.\ndate: 2026-09-08\npublished: true",
  );
  await write(
    "hidden-draft",
    "title: Hidden draft\nsummary: Not ready.\ndate: 2026-09-11\nprojects: [inferrs]\npublished: false",
    "Coming soon...",
  );
  let content = await load();
  assert.deepEqual(
    content.writings.map((writing) => writing.slug),
    ["shared-note", "inferrs-only", "unattached"],
    "published writings sort newest first",
  );
  assert.deepEqual(
    content.byProject.get("inferrs").map((writing) => writing.slug),
    ["shared-note", "inferrs-only"],
    "a writing with two projects appears under each",
  );
  assert.deepEqual(
    content.byProject.get("ledgerkv").map((writing) => writing.slug),
    ["shared-note"],
  );
  assert.deepEqual(
    content.byProject.get("ai4hc"),
    [],
    "projects without writing get an empty list",
  );
  assert.deepEqual(
    content.drafts.map((writing) => writing.slug),
    ["hidden-draft"],
    "unpublished writing stays out of the published set",
  );
  assert.deepEqual(content.writings[0].tags, [], "tags default to empty");

  // Ties on date resolve by slug so list order never wobbles between builds.
  await reset();
  for (const slug of ["beta-note", "alpha-note"])
    await write(
      slug,
      `title: ${slug}\nsummary: Same day.\ndate: 2026-09-05\npublished: true`,
    );
  assert.deepEqual(
    (await load()).writings.map((writing) => writing.slug),
    ["alpha-note", "beta-note"],
  );

  // Every validation failure stops the build rather than publishing silently.
  for (const [front, body, message] of [
    [
      "title: Typo\nsummary: Bad slug.\ndate: 2026-09-05\nprojects: [inferss]\npublished: true",
      complete,
      "unknown project: inferss",
    ],
    [
      "title: Placeholder\nsummary: Empty body.\ndate: 2026-09-05\npublished: true",
      "Coming soon...",
      "Refusing to publish unfinished writing",
    ],
    [
      "title: No date\nsummary: Missing a date.\npublished: true",
      complete,
      "date is required",
    ],
    [
      "title: Bad date\nsummary: Not a date.\ndate: 2026-13-45\npublished: true",
      complete,
      "must be a real YYYY-MM-DD date",
    ],
    [
      "title: Stray\nsummary: Unknown key.\ndate: 2026-09-05\nauthor: someone\npublished: true",
      complete,
      "unknown frontmatter key: author",
    ],
    [
      "title: Scalar\nsummary: Wrong shape.\ndate: 2026-09-05\nprojects: inferrs\npublished: true",
      complete,
      "projects must be a list",
    ],
    [
      "title: Missing summary\ndate: 2026-09-05\npublished: true",
      complete,
      "summary is required",
    ],
  ]) {
    await reset();
    await write("invalid", front, body);
    await rejects(message);
  }
  await reset();
  await writeFile(join(writingDirectory, "no-frontmatter.md"), complete);
  await rejects("missing frontmatter block");

  // Titles routinely contain colons; the parser must keep them intact.
  await reset();
  await write(
    "colon-title",
    "title: Testing consistency: a Jepsen story\nsummary: Colons survive.\ndate: 2026-09-05\npublished: true",
  );
  assert.equal(
    (await load()).writings[0].title,
    "Testing consistency: a Jepsen story",
  );

  // The lifecycle end to end: publish, group by project, then unpublish.
  await reset();
  const build = () =>
    execFileSync(process.execPath, [join(fixture, "scripts/build.mjs")], {
      stdio: "pipe",
    });
  const publishedFront = (title, projects) =>
    `title: ${title}\nsummary: A publishing fixture.\ndate: 2026-09-05\nprojects: [${projects}]\npublished: true`;
  await write(
    "test-note",
    publishedFront("Test note", "inferrs"),
    "Coming soon...",
  );
  assert.throws(build, (error) =>
    error.stderr.toString().includes("Refusing to publish unfinished writing"),
  );
  await write("test-note", publishedFront("Test note", "inferrs"));
  await write("second-note", publishedFront("Second note", "inferrs"));
  await write("unrelated-note", publishedFront("Unrelated note", "ledgerkv"));
  await write("cross-note", publishedFront("Cross note", "inferrs, ledgerkv"));
  build();
  assert.ok(
    (await readFile(join(fixture, "writing/test-note.html"), "utf8")).includes(
      "A completed note",
    ),
  );
  assert.ok(
    (await readFile(join(fixture, "index.html"), "utf8")).includes("Test note"),
  );
  const hub = await readFile(join(fixture, "work/inferrs.html"), "utf8");
  assert.ok(
    hub.includes("Test note") &&
      hub.includes("Second note") &&
      hub.includes("Cross note"),
  );
  assert.ok(!hub.includes("Unrelated note"));
  const sibling = await readFile(join(fixture, "work/ledgerkv.html"), "utf8");
  assert.ok(
    sibling.includes("Unrelated note") && sibling.includes("Cross note"),
  );
  assert.ok(!sibling.includes("Second note"));
  assert.ok(
    (await readFile(join(fixture, "work/ai4hc.html"), "utf8")).includes(
      "Nothing written about",
    ),
    "a project with no writing says so",
  );

  // Old note directories from earlier builds are cleaned up, not left to rot.
  await mkdir(join(fixture, "work/inferrs"), { recursive: true });
  await writeFile(join(fixture, "work/inferrs/notes.html"), "<p>stale</p>");
  build();
  assert.equal(
    await stat(join(fixture, "work/inferrs")).catch(() => null),
    null,
  );

  await write(
    "test-note",
    publishedFront("Test note", "inferrs").replace(
      "published: true",
      "published: false",
    ),
  );
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
    "Content model passed: projects resolved, drafts hidden, invalid frontmatter rejected, stale output removed.",
  );
} finally {
  await rm(fixture, { recursive: true, force: true });
}
