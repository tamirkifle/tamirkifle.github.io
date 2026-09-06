import { chromium } from "@playwright/test";
import { existsSync } from "node:fs";
import { stackArt } from "./art.mjs";
const base = process.env.PREVIEW_URL || "http://127.0.0.1:4173";
const systemChrome =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.CHROME_PATH ||
    (existsSync(systemChrome) ? systemChrome : undefined),
});
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
    colorScheme: "light",
  });
  await page.goto(base);
  await page.setContent(
    `<!doctype html><html lang="en"><head><link rel="stylesheet" href="${base}/css/diagrams.css"><link rel="stylesheet" href="${base}/css/style.css"><style>body{width:1200px;height:630px;padding:60px 70px;overflow:hidden;position:relative}.brand{font:16px var(--sans)}.name{font-family:var(--serif);font-size:83px;letter-spacing:-.04em;line-height:1.1;margin-top:120px;max-width:600px}.name em{display:block;font-size:145px}.description{font-size:19px;color:var(--muted);margin-top:28px;max-width:430px}.art{position:absolute;right:20px;top:76px;width:525px}.art .stack-art{height:430px}.bottom{position:absolute;bottom:35px;left:70px;right:70px;padding-top:20px;border-top:1px solid var(--line);font:12px var(--mono);color:var(--muted)}</style></head><body><p class="brand">tamir.info</p><h1 class="name">Tamir Yirga</h1><p class="description">Notes on the software<br>I’m building.</p><div class="art">${stackArt()}</div><div class="bottom">Inference · Distributed systems · Data</div></body></html>`,
  );
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "media/social-card.png" });
  console.log("Created media/social-card.png");
} finally {
  await browser.close();
}
