# DEPLOY — how to publish and how to change the copy

## How the site is published

- **Repo:** `https://github.com/cwh-works/exceldesign-transition-site` (public). This is the
  master. GitHub Pages serves branch `main` from the repo root.
- **Live:** `https://www.exceldesign.us/` (apex `exceldesign.us` redirects to `www`). DNS is at
  GoDaddy and is already pointed; see `docs/DNS.md`. Do not touch DNS for site changes.
- **Working copy:** `C:\Users\cwhwo\eda-website\` (a clone). `C:\CWH Works Websites\exceldesign-site`
  is an older clone of the same repo; either works, just `git pull` first.

Publishing is one push:

```powershell
cd C:\Users\cwhwo\eda-website
git pull
# ...edit...
git add -A
git commit -m "Copy: <what changed>"
git push
```

Pages rebuilds in about a minute. Hard-refresh the browser (Ctrl+F5) to see it.

After a push that changes anything in the record set, refresh the Shared Drive copy:

```powershell
$rec = "G:\Shared drives\201 – Excel Design Associates - Shared\02_Business_Development\05_Marketing\Website"
robocopy C:\Users\cwhwo\eda-website "$rec\site" index.html styles.css 404.html favicon.svg favicon-32.png og-image.png robots.txt sitemap.xml CNAME .nojekyll /NJH /NJS
robocopy C:\Users\cwhwo\eda-website\screenshots "$rec\screenshots" /E /NJH /NJS
Copy-Item C:\Users\cwhwo\eda-website\DECISIONS.md, C:\Users\cwhwo\eda-website\DEPLOY.md, C:\Users\cwhwo\eda-website\README.md $rec
```

## Where the copy lives (`index.html`)

All copy is in `index.html`. Line numbers as of the 2026-09-05 build:

| What | Lines |
|---|---|
| `<title>`, meta description, Open Graph text | 8–20 |
| Masthead descriptor ("Civil engineering · Colorado City…") | 41 |
| Hero: eyebrow, h1, sub-line, email button | 57–61 |
| Our story: three timeline beats | 69–85 |
| People · Place · Possibility | 91–106 |
| What we do: five service groups | 112–158 |
| Better Together paragraph | 164–166 |
| Contact: email, PO Box, licensing line | 171–189 |
| Footer: © line and "updated <date>" | 192–203 |

Update the `updated` date in the footer (`<time datetime="…">`) and `<lastmod>` in
`sitemap.xml` when the copy changes.

Colours, fonts and spacing are in `styles.css`; the palette tokens are the first block.

## Before pushing a copy change

```powershell
cd C:\Users\cwhwo\eda-website
npm install            # once per machine; dev tooling only
npm run check          # copy guards: no phone/street address/licence numbers, anchors, contrast
npm run validate       # html-validate
npm run shoot          # re-shoot screenshots/ at 390/768/1280/1920 + favicon-32.png + og-image.png
```

`npm run shoot` drives the installed Google Chrome (no browser download). Look at the
screenshots before pushing.

## Replacing the placeholder logo

The mark is inline SVG in two places in `index.html` (masthead, line 35; footer, line 195) and
in `favicon.svg`; `favicon-32.png` and `og-image.png` are rendered from it by `tools/shoot.mjs`.
When the final identity arrives: replace the two inline `<svg>` blocks and `favicon.svg`, update
the SVG in `tools/shoot.mjs`, run `npm run shoot`, push.

## Optional — rename the repo (`gh` is installed and signed in)

```powershell
gh repo rename eda-website --repo cwh-works/exceldesign-transition-site
git -C C:\Users\cwhwo\eda-website remote set-url origin https://github.com/cwh-works/eda-website.git
```

GitHub redirects the old repo name and Pages keeps serving, so the rename is safe.
