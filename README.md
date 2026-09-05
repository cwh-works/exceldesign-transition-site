# Excel Design Associates — website

The single-page site at **www.exceldesign.us** for Excel Design Associates, a principal-led civil
engineering firm in the Short Creek community (Colorado City, Arizona / Hildale, Utah). Built
2026-09-05 during the brand rebuild; it replaced the "refreshing our brand" placeholder that lived
in this repository from 2026-08-26. Plain static HTML and CSS, no build step, no JavaScript,
Google Fonts is the only external reference.

**This GitHub repository is the master.** GitHub Pages publishes `main` from the root. The
Shared Drive folder
`G:\Shared drives\201 – Excel Design Associates - Shared\02_Business_Development\05_Marketing\Website\`
is the **company record** — a dated copy of the site, screenshots and these notes, downstream of
the repo. The `brand/` folder in the working copy is **intentionally untracked** (`.gitignore`):
it holds internal brand documents. The brand master is
`C:\Obsidian Vault\201 - Excel Design Associates\Excel_Design_Associates_Brand_Identity.md`.
The X mark on the site is a **placeholder** pending the final identity work.

| File | Purpose |
|---|---|
| `index.html` | The page — all copy is here |
| `styles.css` | Palette tokens, type, layout |
| `404.html` | Not-found page |
| `favicon.svg`, `favicon-32.png`, `og-image.png` | Generated from the placeholder mark |
| `robots.txt`, `sitemap.xml`, `CNAME`, `.nojekyll` | Crawling, sitemap, Pages custom domain |
| `docs/DNS.md` | DNS record: what was changed on 2026-08-26 and what must never change |
| `DECISIONS.md` | Every judgment call in the build |
| `DEPLOY.md` | How to publish, where the copy lives, what still needs Charles |
| `screenshots/` | 390 / 768 / 1280 / 1920 full-page renders of the current build |
| `tools/`, `package.json` | Dev tooling only: screenshots, HTML validation, copy guards |
