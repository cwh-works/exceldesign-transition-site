// Copy guards: fail if anything that must not be published appears in the site files.
// Also checks the internal anchors and the mailto, and WCAG contrast for the text pairs used.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(path.join(root, "index.html"), "utf8");
const css = await readFile(path.join(root, "styles.css"), "utf8");
const text = html.replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ");

let failed = false;
const fail = (m) => { failed = true; console.error("FAIL: " + m); };
const ok = (m) => console.log("ok:   " + m);

// 1. Forbidden strings
const forbidden = [
  /\(435\)/, /435[-.\s]\d{3}[-.\s]\d{4}/, /Julias/i, /Utah Ave/i, /035974/, /45354/, /52907/, /6269227/,
  /1185 W/i, /1740 S/i, /Suite 102/i, /\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/, /tel:/i,
];
for (const re of forbidden) {
  if (re.test(text)) fail(`forbidden pattern ${re} present`); else ok(`absent ${re}`);
}

// 2. Required strings
const required = [
  "PO Box 190", "Colorado City, AZ 86021", "charles@exceldesign.us",
  "Licensed professional engineer — Utah, Arizona, Nevada", "© 2026 Excel Design Associates, LC",
  "Building Purpose and Community, by", "Better Together", "January 2006", "January 2013", "Excel Civil Design", "Mesquite",
];
for (const s of required) { if (text.includes(s)) ok(`present "${s}"`); else fail(`missing "${s}"`); }

// 3. Anchors
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
for (const m of html.matchAll(/href="#([^"]+)"/g)) {
  if (ids.has(m[1])) ok(`anchor #${m[1]}`); else fail(`dangling anchor #${m[1]}`);
}
const mailtos = [...html.matchAll(/href="mailto:([^"]+)"/g)].map(m => m[1]);
if (mailtos.length && mailtos.every(m => m === "charles@exceldesign.us")) ok(`mailto x${mailtos.length} -> charles@exceldesign.us`);
else fail(`mailto set: ${mailtos.join(", ")}`);

// 4. Exactly one h1
const h1s = (html.match(/<h1[\s>]/g) || []).length;
if (h1s === 1) ok("one h1"); else fail(`${h1s} h1 elements`);

// 5. Contrast (WCAG 2.x relative luminance)
const lum = (hex) => {
  const [r, g, b] = hex.replace("#", "").match(/../g).map(h => parseInt(h, 16) / 255)
    .map(c => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };
const pairs = [
  ["Sandstone on Charcoal (eyebrows, footer)", "#C9B79C", "#25282B", 4.5],
  ["Slate on White (dt labels)", "#60676D", "#FFFFFF", 4.5],
  ["Slate on Desert White (intro, timeline year)", "#60676D", "#F4F1EB", 4.5],
  ["Desert White on Charcoal (hero body)", "#F4F1EB", "#25282B", 4.5],
  ["Red on White (links, pillar h3 — large)", "#B3261E", "#FFFFFF", 4.5],
  ["Red on Desert White (links)", "#B3261E", "#F4F1EB", 4.5],
  ["White on Red (button)", "#FFFFFF", "#B3261E", 4.5],
  ["Charcoal on Desert White (body)", "#25282B", "#F4F1EB", 4.5],
];
for (const [name, fg, bg, min] of pairs) {
  const r = ratio(fg, bg);
  if (r >= min) ok(`${name}: ${r.toFixed(2)}:1`); else fail(`${name}: ${r.toFixed(2)}:1 < ${min}`);
}
// Make sure red text is never set on charcoal in the CSS (2.3:1 — would fail)
if (/\.hero[^{]*\{[^}]*color:\s*var\(--red\)/.test(css)) fail("red text on charcoal in .hero");

console.log(failed ? "\nCOPY CHECK FAILED" : "\nCOPY CHECK PASSED");
process.exit(failed ? 1 : 0);
