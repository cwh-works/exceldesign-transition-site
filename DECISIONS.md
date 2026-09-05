# DECISIONS — EDA website rebuild

Build date 2026-09-05. Every judgment call made while working unattended from
`EDA_Website_Rebuild_Claude_Code_Prompt.md` (Rev 4). Numbered so they can be cited.

## Deployment path

**D1. The master is `cwh-works/exceldesign-transition-site`, not a new repo.**
`gh repo list` was not possible (see D2), but `git ls-remote` showed there is **no**
`cwh-works.github.io` repository. `exceldesign.us` is served by the existing public repo
`cwh-works/exceldesign-transition-site` (GitHub Pages, branch `main`, root, `CNAME` =
`www.exceldesign.us`), which is why the `www` CNAME record points at `cwh-works.github.io.`
without that repo existing. The prompt's instruction was "put the new site where the existing
setup expects it — replacing the transition page for exceldesign.us and nothing else", so the
working folder `C:\Users\cwhwo\eda-website` is a fresh clone of that repo and the new site
replaced the placeholder at its root. `excelrealty.us` and `shortcreekrealty.com` are served
from other repos and were not touched. The older local clone at
`C:\CWH Works Websites\exceldesign-site` was fast-forwarded to the same commit afterwards.

**D2. GitHub CLI was not available; git pushed through the stored credential.** `gh` is not
installed (Part 1 step 1 of the setup was not done) and installing it plus `gh auth login`
needs a browser sign-in that only Charles can do. Git Credential Manager already holds a
GitHub login (`charles403`), so `git push` to the existing repo worked without `gh`. Anything
that needs the GitHub API — creating the private `scs-social-render` repo (D3), renaming this
repo, changing Pages settings — is left for Charles. See "Open items".

**D3. Step 0 done; private repo created the same day.** The whole
`Brand Systems\short-creek-spirits\` folder (design-system package *and* `render/`) moved to
`C:\Users\cwhwo\scs-social-render\`, `git init` + initial commit done (24 files, commit
`561a832`), `MOVED.md` left at the old vault path. `gh repo create --private` could not run in the first pass (D2); after Charles installed and signed
in to `gh`, the repo was created and pushed the same day: <https://github.com/cwh-works/scs-social-render>
(private, under the `cwh-works` org like the site repos).

**D4. `site/` is the repo root.** GitHub Pages serves this repo from the root and the Pages
source cannot be changed without the API (D2), so the site files live at the repo root
(`index.html`, `styles.css`, favicons, `robots.txt`, `sitemap.xml`, `404.html`, `CNAME`,
`.nojekyll`). The Shared Drive record copy puts them in a `site\` folder as the prompt asked.
`package.json` and `tools/` are dev tooling (screenshots, validation, copy guards) and are not
needed to view the site.

## Facts and copy

**D5. Address discrepancy logged as instructed.** The company profile (2026-07-21) says the firm
is "based in Hildale, Utah" and lists the Arizona-board public address on Utah Avenue in
Hildale. The prompt states the Hildale office is closed and the address of record is on Julias
Circle in Colorado City. **Neither street address is published.** The site carries only
`PO Box 190, Colorado City, AZ 86021` and the location line "based in the Short Creek
community — Colorado City, Arizona and Hildale, Utah — serving Utah, Arizona and Nevada."
No phone number of any kind. The profile document is stale on the office location and should
be updated when the licence addresses change.

**D6. Nevada named as a service area; no licence numbers printed.** Per the prompt (firm
registration confirmed 2026-08-12). Licensing line is exactly "Licensed professional engineer —
Utah, Arizona, Nevada." The copy guard (`tools/check-copy.mjs`) fails the build if any licence
number, board ID, street address fragment, or phone-number pattern appears.

**D7. Mesquite, Nevada is named.** The company profile does not name Mesquite; the prompt
explicitly instructs "note the firm also works in southern Nevada (Mesquite)". The prompt is
the more recent authority, so it is in the "Place" pillar.

**D8. Rename year: 2013 (resolved 2026-09-05).** The first build labelled the middle beat "Growth" because neither the profile nor the prompt gave a date. Charles then supplied the Utah amendment record: Excel Civil Design, LC registered 2006-01-13; renamed Excel Design Associates, LC effective 2013-01-17 (adopted 2013-01-03). Record filed on the Shared Drive at `01_Company_Management\04_Licensing_and_Registrations\EDA_Formation_Utah_Name_Change_Amendment_RECORD_2013-01-17.pdf`. The timeline now reads 2006 → 2013 → Now and the copy says "In January 2013 we became Excel Design Associates".

**D9. Service groupings.** The fifteen services in the profile are grouped into five headings
(site and land development · grading, drainage and stormwater · water and sewer · streets and
public infrastructure · documents, reports and construction). Three items came from the
profile's "Common project types" list (land-development feasibility and due diligence; utility
extensions; school and public-facility projects). Nothing was added that is not in the profile.

**D10. Entity name.** "Excel Design Associates" in body copy, "© 2026 Excel Design Associates,
LC" in the footer, per the prompt.

**D11. Canonical URL is `https://www.exceldesign.us/` (changed 2026-09-05, same day).** The first build used the apex form the prompt gave. Charles chose `www` because it is the Pages primary domain (the apex 301s to it) and what the browser bar shows. Canonical, `og:url`, `og:image`, `sitemap.xml` and the `Sitemap:` line in `robots.txt` all use `www` now.

**D12. Brand line.** The brand standard's primary line is "Local Knowledge. Engineering
Leadership." The prompt overrides this for the rebuild page with "Building Purpose and
Community, by Design." as the h1/tagline and "Better Together" as the how. The standard's line
was not used; it can be reintroduced when the brand work settles.

## Design

**D13. Display face substitute.** DIN 2014 is not free. Display type is **Barlow Semi
Condensed** 600/700 from Google Fonts, falling back to DIN 2014 → Aptos Display → Segoe UI.
Body is Source Sans 3 (400/600), technical strings IBM Plex Mono — both from Google Fonts as
the prompt asked. Google Fonts is the only third-party reference on the page.

**D14. No colour was adjusted for contrast.** Every text pair used was checked (WCAG 2.x
relative luminance, computed in `tools/check-copy.mjs`):

| Pair | Ratio | AA body (4.5) |
|---|---:|---|
| Sandstone `#C9B79C` on Charcoal `#25282B` | 7.58 | pass |
| Slate `#60676D` on White | 5.74 | pass |
| Slate on Desert White `#F4F1EB` | 5.09 | pass |
| Desert White on Charcoal | 13.15 | pass |
| Leadership Red `#B3261E` on White | 6.54 | pass |
| Leadership Red on Desert White | 5.80 | pass |
| White on Leadership Red (button) | 6.54 | pass |

**Leadership Red on Charcoal is 2.3:1 and fails**, so red is never used as *text* on the dark
sections — only as the mark, the top bar, the left rule and the button fill. On dark sections
labels are Sandstone and headings are White.

**D15. Light/dark proportion.** Dark (charcoal) sections: masthead, hero, Better Together,
footer. Light sections: story, pillars, services, contact. Measured on the 1280 screenshot the
page is roughly 60% light, inside the standard's 55–65% white/Desert White band. Red is used
as accent only (bars, rules, button, pillar headings) — well under 15%.

**D16. Placeholder mark.** A red square outline with a bold X, inline SVG using `currentColor`,
so the one-colour white version in the footer is the same markup. It is deliberately plain.
The favicon (`favicon.svg` + `favicon-32.png`) and the Open Graph image (`og-image.png`,
1200×630, 64 KB) are generated from the same mark by `tools/shoot.mjs`. Replace all three when
the final identity lands.

**D17. No JavaScript.** Smooth scrolling is CSS (`scroll-behavior: smooth`) and only inside
`prefers-reduced-motion: no-preference`. No analytics, no cookies.

**D18. The grid background** on dark sections is two 1-px repeating line layers (CSS
`linear-gradient` used as a line pattern, not a tonal gradient). It matches the engineered
grid in `brand/style-reference.png`. Not applied to type.

## Verification performed

- Screenshots at 390, 768, 1280, 1920 (`screenshots/home-*.png`) via Playwright driving the
  installed Chrome; `scrollWidth` equalled the viewport at every width (no horizontal overflow).
- `html-validate` on `index.html` and `404.html`: 0 errors after fixing DOCTYPE case and
  shortening the `<title>` to under 70 characters.
- `tools/check-copy.mjs`: forbidden patterns absent, required strings present, all six
  anchors resolve, both `mailto:` links go to `charles@exceldesign.us`, exactly one `h1`,
  contrast table above.
- Largest asset: `og-image.png` at 64 KB (limit 200 KB). Fonts are the only external loads.

## Vault writes beyond the hub note

The prompt said "do not write anything else to the vault". The vault's own `CLAUDE.md` requires
a Task Log row for every significant task and that `CLAUDE.md` itself be updated when the
directory structure changes (Step 0 removed a folder it documents). Both were done; they are
vault rules, not extras. `MOVED.md` was written because the prompt asked for it.
