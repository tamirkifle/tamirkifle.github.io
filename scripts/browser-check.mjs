import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { loadWriting } from "./content.mjs";

// Nothing here names a slug. The published collection can be empty, and the
// checks that need a real article are skipped rather than pinned to one.
const site = JSON.parse(await readFile("content/site.json", "utf8"));
const { writings, drafts } = await loadWriting(site);
const sample = writings[0];
const sampleRoutes = sample ? [sample.url] : [];

const base = process.env.PREVIEW_URL || "http://127.0.0.1:4173";
const systemChrome =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const executablePath =
  process.env.CHROME_PATH ||
  (existsSync(systemChrome) ? systemChrome : undefined);
const browser = await chromium.launch({ executablePath, headless: true });
const output = "test-results";
await mkdir(output, { recursive: true });
const pages = [
  "/",
  "/work.html",
  "/about.html",
  "/work/inferrs.html",
  ...sampleRoutes,
  "/work/ledgerkv.html",
  "/work/ski-tracker.html",
  "/work/ai4hc.html",
  "/work/vision-profiler.html",
  "/work/object-recognition.html",
  "/writing.html",
  `/post.html?slug=${drafts[0].slug}`,
];
const report = {
  routes: [],
  responsive: [],
  accessibility: [],
  interactions: [],
  errors: [],
};
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    colorScheme: "light",
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => report.errors.push(error.message));
  page.on("response", (response) => {
    // Third-party embeds are not ours to police, and a transient 4xx from one
    // should not fail the suite. Only our own responses count.
    if (response.status() >= 400 && response.url().startsWith(base))
      report.errors.push(`${response.status()} ${response.url()}`);
  });
  for (const route of pages) {
    const response = await page.goto(`${base}${route}`, {
      waitUntil: "networkidle",
    });
    assert.equal(response.status(), 200, route);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("h1").count(), 1);
    report.routes.push({ route, title: await page.title() });
  }
  for (const width of [360, 390, 560, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/work.html",
      "/about.html",
      "/work/inferrs.html",
      ...sampleRoutes,
      "/work/ledgerkv.html",
      "/work/object-recognition.html",
    ]) {
      await page.goto(`${base}${route}`);
      await page.evaluate(() => document.fonts.ready);
      const sizes = await page.evaluate(() => ({
        viewport: innerWidth,
        body: document.documentElement.scrollWidth,
      }));
      assert.ok(
        sizes.body <= sizes.viewport,
        `Overflow: ${route} at ${width}: ${sizes.body}`,
      );
      report.responsive.push({ route, width, overflow: false });
    }
  }
  for (const theme of ["light", "dark"]) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base);
    await page.evaluate(
      (value) => localStorage.setItem("tamir-theme", value),
      theme,
    );
    for (const route of [
      "/",
      "/about.html",
      "/work/inferrs.html",
      ...sampleRoutes,
      "/work/ledgerkv.html",
      "/work/object-recognition.html",
      "/writing.html",
    ]) {
      await page.goto(`${base}${route}`);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        // axe descends into frames, and the YouTube player's own markup fails
        // rules we cannot fix. Our page is in scope; their embed is not.
        .exclude(".video-frame iframe")
        .analyze();
      report.accessibility.push({
        route,
        theme,
        violations: result.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
      });
    }
  }
  await page.goto(base);
  assert.equal(
    await page
      .locator(
        '.eyebrow, .location-dot, .solid-link, a[href="/media/resume.pdf"]',
      )
      .count(),
    0,
  );
  assert.equal(await page.locator(".experience-list").count(), 0);
  report.interactions.push(
    "Home stays a project and writing index without employment promotions",
  );
  const before = await page.locator("html").getAttribute("data-theme");
  await page.getByRole("button", { name: /Switch to .* theme/ }).click();
  const after = await page.locator("html").getAttribute("data-theme");
  assert.notEqual(before, after);
  await page.reload();
  assert.equal(await page.locator("html").getAttribute("data-theme"), after);
  report.interactions.push("Theme changes and persists on reload");
  for (const step of ["Compute", "Sample", "Load"]) {
    const button = page.getByRole("button", { name: new RegExp(step) });
    await button.click();
    assert.equal(await button.getAttribute("aria-pressed"), "true");
    assert.equal(await page.locator(".stack-layer.is-active").count(), 1);
    assert.ok(await page.locator(".hero-diagram .diagram-caption").innerText());
  }
  report.interactions.push(
    "All three diagram stages update visual layer, text, and button state",
  );
  for (const route of ["/", "/work.html", "/work/ledgerkv.html"]) {
    await page.goto(`${base}${route}`);
    const network = page.locator(".replication-diagram");
    const quorum = network.getByRole("button", { name: "Quorum", exact: true });
    const raft = network.getByRole("button", { name: "Raft", exact: true });
    await quorum.click();
    assert.equal(await quorum.getAttribute("aria-pressed"), "true");
    assert.equal(await raft.getAttribute("aria-pressed"), "false");
    assert.match(
      await network.locator("svg").getAttribute("aria-label"),
      /no elected leader/,
    );
    assert.match(
      await network.locator(".diagram-caption").innerText(),
      /any 3 successful acknowledgements/,
    );
    assert.equal(
      await network.locator('[data-network-mode="raft"]').isVisible(),
      false,
    );
    assert.equal(
      await network.locator('[data-network-mode="quorum"]').isVisible(),
      true,
    );
    assert.ok(
      await network.evaluate(
        (el) => el.getAnimations({ subtree: true }).length > 0,
      ),
    );
    // Interrupt a write in flight, then replay the selected mode.
    await raft.click();
    assert.equal(
      await network
        .locator('[data-network-mode="quorum"]')
        .evaluate((el) => el.getAnimations({ subtree: true }).length),
      0,
    );
    await raft.click();
    assert.match(
      await network.locator(".diagram-caption").innerText(),
      /elected leader/,
    );
    await page.waitForFunction(
      () =>
        document
          .querySelector(".replication-diagram")
          .getAnimations({ subtree: true }).length === 0,
    );
    assert.equal(
      await network
        .locator(".network-packet")
        .evaluateAll((packets) =>
          packets.every((packet) => getComputedStyle(packet).opacity === "0"),
        ),
      true,
    );
  }
  report.interactions.push(
    "LedgerKV modes change topology, explain the write, cancel interrupted animations, and settle after replay on all three pages",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  const network = page.locator(".replication-diagram");
  await network.getByRole("button", { name: "Quorum", exact: true }).focus();
  await page.keyboard.press("Enter");
  assert.equal(
    await network
      .getByRole("button", { name: "Quorum", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  assert.equal(
    await network.evaluate((el) => el.getAnimations({ subtree: true }).length),
    0,
  );
  assert.match(
    await network.locator(".diagram-caption").innerText(),
    /Any node/,
  );
  const quorumReplays = await network.evaluate((el) => {
    const originalRandom = Math.random;
    let seed = 9347;
    Math.random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    try {
      return Array.from({ length: 100 }, () => {
        el.querySelector('button[data-mode="quorum"]').click();
        const group = el.querySelector('[data-network-mode="quorum"]');
        return {
          acknowledged: [
            ...group.querySelectorAll(".network-confirmation:not([hidden])"),
          ].map((ring) => Number(ring.dataset.node)),
          confirmedPaths: [...group.querySelectorAll(".route-confirmed")]
            .map((path) => Number(path.dataset.replica))
            .filter(Boolean)
            .sort(),
          writes: group.querySelectorAll('[data-phase="replicate"]').length,
          description: el.querySelector("svg").getAttribute("aria-label"),
          animations: el.getAnimations({ subtree: true }).length,
        };
      });
    } finally {
      Math.random = originalRandom;
    }
  });
  for (const [index, replay] of quorumReplays.entries()) {
    assert.equal(new Set(replay.acknowledged).size, 3);
    assert.equal(replay.writes, 4); // Four remote writes plus the coordinator's local replica.
    assert.equal(replay.animations, 0);
    assert.deepEqual(
      replay.confirmedPaths,
      replay.acknowledged.filter((node) => node !== 2),
    );
    for (const node of replay.acknowledged) {
      assert.ok(replay.description.includes(String(node).padStart(2, "0")));
    }
    if (index > 0)
      assert.notDeepEqual(
        replay.acknowledged,
        quorumReplays[index - 1].acknowledged,
      );
  }
  assert.equal(
    new Set(quorumReplays.map((replay) => replay.acknowledged.join(","))).size,
    10,
  );
  report.interactions.push(
    "Quorum replays cover every three-of-five combination, including sets without the coordinator, while writes still reach every replica",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  report.interactions.push(
    "Keyboard mode selection works with reduced motion and no animation",
  );
  for (const theme of ["light", "dark"]) {
    await page.evaluate(
      (value) => localStorage.setItem("tamir-theme", value),
      theme,
    );
    await page.reload();
    await network.getByRole("button", { name: "Quorum", exact: true }).click();
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    report.accessibility.push({
      route: "/work/ledgerkv.html",
      theme: `${theme}-quorum`,
      violations: result.violations,
    });
    await page.waitForFunction(
      () =>
        document
          .querySelector(".replication-diagram")
          .getAnimations({ subtree: true }).length === 0,
    );
    await network.screenshot({
      path: `${output}/ledgerkv-quorum-${theme}.png`,
    });
  }
  await page.goto(base);
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent),
    "Skip to content",
  );
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => location.hash), "#main");
  report.interactions.push("Skip link works from the keyboard");
  await page.goto(`${base}/post.html?slug=../../content/site`);
  assert.match(await page.locator("h1").innerText(), /isn’t published/);
  report.interactions.push(
    "Invalid and unpublished legacy article URLs have a useful fallback",
  );
  if (sample) {
    await page.goto(`${base}/post.html?slug=${sample.slug}`);
    await page.waitForURL(`${base}${sample.url}`);
    assert.equal(await page.locator("h1").innerText(), sample.title);
    report.interactions.push("Legacy URLs redirect to published writing");
  } else {
    await page.goto(`${base}/writing.html`);
    assert.match(
      await page.locator(".notes-empty").innerText(),
      /Nothing published/,
    );
    report.interactions.push("Empty writing index states that plainly");
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  report.interactions.push("Reduced motion disables smooth scrolling");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(base);
  await page.evaluate(() => localStorage.setItem("tamir-theme", "light"));
  await page.reload();
  await page.screenshot({ path: `${output}/home-desktop.png`, fullPage: true });
  await page.screenshot({ path: `${output}/home-desktop-top.png` });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: `${output}/home-mobile.png`, fullPage: true });
  await page.screenshot({ path: `${output}/home-mobile-top.png` });
  const mobileAxe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  report.accessibility.push({
    route: "/",
    theme: "light-mobile",
    violations: mobileAxe.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.screenshot({ path: `${output}/home-dark.png`, fullPage: true });
  await page.goto(`${base}/work/ledgerkv.html`);
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await page.screenshot({
    path: `${output}/project-desktop.png`,
    fullPage: true,
  });
  await page.goto(`${base}/about.html`);
  await page.screenshot({
    path: `${output}/about-desktop.png`,
    fullPage: true,
  });
  if (sample) {
    await page.goto(`${base}${sample.url}`);
    await page.screenshot({
      path: `${output}/note-desktop.png`,
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: `${output}/note-mobile.png`,
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/work/inferrs.html`);
  await page.screenshot({
    path: `${output}/project-mobile.png`,
    fullPage: true,
  });
  const noJS = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const basic = await noJS.newPage();
  await basic.goto(base);
  assert.equal(await basic.locator(".project-row").count(), 4);
  assert.equal(await basic.getByRole("link", { name: /^InferRS/ }).count(), 1);
  assert.equal(await basic.locator(".theme-toggle").isVisible(), false);
  assert.equal(
    await basic.locator(".replication-diagram .diagram-controls").isVisible(),
    false,
  );
  assert.equal(
    await basic.locator('[data-network-mode="raft"]').isVisible(),
    true,
  );
  assert.equal(
    await basic.locator('[data-network-mode="quorum"]').isVisible(),
    false,
  );
  await basic.getByRole("link", { name: /^InferRS/ }).click();
  assert.equal(await basic.locator("h1").innerText(), "InferRS");
  const inferrsWriting = writings.filter((writing) =>
    writing.projects.includes("inferrs"),
  );
  if (inferrsWriting.length) {
    await basic.getByRole("link", { name: inferrsWriting[0].title }).click();
    assert.equal(
      await basic.locator("h1").innerText(),
      inferrsWriting[0].title,
    );
  } else {
    // With nothing published the section is dropped, not left empty.
    assert.equal(await basic.locator("#writing").count(), 0);
  }
  report.interactions.push(
    "Content and navigation work with JavaScript disabled",
  );
  await noJS.close();
  assert.equal(report.errors.length, 0, JSON.stringify(report.errors));
  const violations = report.accessibility.flatMap((item) =>
    item.violations.map((v) => ({
      ...v,
      route: item.route,
      theme: item.theme,
    })),
  );
  assert.equal(violations.length, 0, JSON.stringify(violations, null, 2));
  console.log(
    `Passed ${report.routes.length} routes, ${report.responsive.length} responsive checks, ${report.accessibility.length} axe scans, and ${report.interactions.length} interaction checks.`,
  );
} finally {
  await writeFile(
    `${output}/report.json`,
    JSON.stringify(report, null, 2) + "\n",
  );
  await browser.close();
}
