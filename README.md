# Excel Design Associates — Transitional Landing Page

A single-page placeholder at **www.exceldesign.us** announcing that Excel
Design Associates is refreshing its brand. Same hosting pattern as the Short
Creek Realty transitional site (`cwh-works/scr-transition-site`).

## How it is deployed

- **This repository (`cwh-works/exceldesign-transition-site`) is the single
  source of truth.** It is published with GitHub Pages (branch `main`, root)
  at `www.exceldesign.us`; the apex `exceldesign.us` redirects to `www`.
- One domain only — unlike the Realty site there is **no mirror repo** and no
  sync workflow.
- Edit files, push to `main`, and the live site updates (Pages build takes
  about a minute).

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole page (inline CSS, no build step; Google Fonts is the only external reference) |
| `404.html` | Not-found page |
| `CNAME` | Custom domain for GitHub Pages |
| `robots.txt` | Allows crawling |
| `docs/DNS.md` | DNS configuration: what changed, what must be preserved |

## Contact address

The page lists `info@exceldesign.us` — a free Google Workspace email alias on
`charles@cwhworks.com` (added 2026-08-26). Inquiries land in Charles's inbox.
Replies come from the primary address unless a "send as" alias is configured
in Gmail settings.

## Brand

Follows the "Modern Engineering Authority" standard: Leadership Red `#B3261E`
(accent only), Deep Canyon Red `#7D1F17` (hover), Engineering Charcoal
`#25282B`, Structural Slate `#60676D`, Sandstone `#C9B79C` (hairlines),
Desert White `#F4F1EB` (field). Headings in Aptos Display falling back to
Inter. Flat design: no gradients, shadows, rounded corners, or imagery.
