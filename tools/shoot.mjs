// Screenshots at four widths + favicon-32.png + og-image.png.
// Uses Playwright driving the installed Chrome (channel "chrome"), so no browser download.
// Usage: node tools/shoot.mjs   (starts its own static server on 127.0.0.1:8787)
import { chromium } from "playwright";
import http from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 8787;
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".xml": "application/xml", ".txt": "text/plain" };

const server = http.createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  try {
    const data = await readFile(path.join(root, p));
    res.writeHead(200, { "content-type": types[path.extname(p)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404, { "content-type": "text/html" });
    res.end(await readFile(path.join(root, "404.html")));
  }
});
await new Promise(r => server.listen(PORT, "127.0.0.1", r));

const browser = await chromium.launch({ channel: "chrome" });
await mkdir(path.join(root, "screenshots"), { recursive: true });

// Full-page screenshots
for (const width of [390, 768, 1280, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  if (sw > width) console.warn(`WARN: horizontal overflow at ${width}: scrollWidth=${sw}`);
  await page.screenshot({ path: path.join(root, "screenshots", `home-${width}.png`), fullPage: true });
  console.log(`shot ${width} (scrollWidth ${sw})`);
  await page.close();
}

// favicon-32.png from favicon.svg
{
  const page = await browser.newPage({ viewport: { width: 32, height: 32 }, deviceScaleFactor: 1 });
  const svg = await readFile(path.join(root, "favicon.svg"), "utf8");
  await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:32px;height:32px}</style>${svg}`);
  await page.screenshot({ path: path.join(root, "favicon-32.png"), omitBackground: true });
  await page.close();
  console.log("favicon-32.png");
}

// og-image.png 1200x630 — flat charcoal, mark, tagline
{
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html><head>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
  <style>
    html,body{margin:0;width:1200px;height:630px}
    body{background:#25282B;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:48px 48px;color:#F4F1EB;font-family:"Source Sans 3",sans-serif;position:relative}
    .bar{position:absolute;top:0;left:0;right:0;height:12px;background:#B3261E}
    .box{position:absolute;left:80px;top:80px;bottom:80px;border-left:6px solid #B3261E;padding-left:40px;display:flex;flex-direction:column;justify-content:space-between}
    .brand{display:flex;align-items:center;gap:22px}
    .word{font-family:"Barlow Semi Condensed",sans-serif;font-weight:700;font-size:34px;letter-spacing:.14em;text-transform:uppercase;color:#fff}
    .desc{font-size:16px;letter-spacing:.14em;text-transform:uppercase;color:#C9B79C;margin-top:6px}
    h1{font-family:"Barlow Semi Condensed",sans-serif;font-weight:700;font-size:84px;line-height:1.05;margin:0;color:#fff;max-width:900px}
    p{font-size:26px;margin:0;color:#F4F1EB;max-width:900px}
  </style></head><body>
  <div class="bar"></div>
  <div class="box">
    <div class="brand">
      <svg viewBox="0 0 64 64" width="72" height="72"><rect x="4" y="4" width="56" height="56" fill="none" stroke="#B3261E" stroke-width="5"/><path d="M18 18 L46 46 M46 18 L18 46" fill="none" stroke="#B3261E" stroke-width="7" stroke-linecap="square"/></svg>
      <div><div class="word">Excel Design Associates</div><div class="desc">Civil engineering · Colorado City, Arizona · Hildale, Utah</div></div>
    </div>
    <h1>Building Purpose and Community, by Design.</h1>
    <p>A principal-led civil engineering practice in the Short Creek community, serving Utah, Arizona and Nevada.</p>
  </div></body></html>`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(root, "og-image.png") });
  await page.close();
  console.log("og-image.png");
}

await browser.close();
server.close();
