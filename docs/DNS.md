# DNS Configuration — exceldesign.us

Domain registered and DNS-hosted at **GoDaddy** (Excel/Realty account).
Modeled on the Short Creek Realty repoint of 2026-07-10
(`shortcreek-realty-site/docs/DNS.md`).

## Status

**APPLIED 2026-08-26** with Charles's approval, via the `gddy` CLI
(Excel/Realty account, dry-run first). Verified same day: authoritative NS
serves the four GitHub A records and the `www` CNAME; the page serves with
`Server: GitHub.com` and the apex 301s to `www`.

Gotcha hit during the change: GoDaddy's API refused `gddy dns set` on the
existing `CNAME www` ("already has conflicting CNAME data") even though the
dry-run planned a clean replace. `gddy dns delete` + `gddy dns add` worked.
The A-record `set` (replacing the special `"Parked"` value) had no such
problem.

## Planned change (web records only)

Verified against the live zone via `gddy dns list exceldesign.us` on
2026-08-26. The apex holds a single special record `A @ = "Parked"` (TTL 600)
that GoDaddy expands to its parking anycast IPs (`3.33.130.190` /
`15.197.148.33` in public DNS).

| Record | Before | After |
| --- | --- | --- |
| `A @` | `"Parked"` (special GoDaddy parking record) — replaced | `185.199.108.153` |
| `A @` | — | `185.199.109.153` |
| `A @` | — | `185.199.110.153` |
| `A @` | — | `185.199.111.153` |
| `CNAME www` | `exceldesign.us.` | `cwh-works.github.io.` |

`185.199.108–111.153` are GitHub Pages' anycast IPs. `www.exceldesign.us` is
the primary domain on the Pages site (via this repo's `CNAME` file); GitHub
redirects the apex to `www`. The old GoDaddy Websites + Marketing Free site
stays in the account but is disconnected from the domain once these records
change.

## What must NOT change — email and verification

These keep Google Workspace email and domain verification working. Never
delete or modify them when editing DNS:

| Record | Value | Purpose |
| --- | --- | --- |
| `MX @` | `smtp.google.com.` (priority 1) | Google Workspace mail delivery |
| `TXT @` | `v=spf1 include:_spf.google.com ~all` | SPF (anti-spoofing) |
| `TXT google._domainkey` | `v=DKIM1; k=rsa; p=…` | DKIM email signing (present and verified in the live zone) |
| `TXT _dmarc` | `v=DMARC1; p=quarantine; …` | DMARC policy |
| `TXT @` | `google-site-verification=…` | Google domain verification |
| `NS @` | `ns75/ns76.domaincontrol.com` | GoDaddy nameservers (read-only in gddy) |
| `CNAME _domainconnect` | `_domainconnect.gd.domaincontrol.com.` | GoDaddy Domain Connect |

## Rollback

Delete the four `A @` records and re-connect the domain to the GoDaddy
Websites + Marketing site (GoDaddy recreates its records); restore
`CNAME www` to its previous value. Email records need no changes in either
direction.

## HTTPS

**Done 2026-08-26.** Let's Encrypt certificate issued for both
`www.exceldesign.us` and `exceldesign.us` (verified: full-chain validation
passes, SAN covers both hosts), and "Enforce HTTPS" is enabled — `http://`
now 301s to `https://`.

Gotcha: because the custom domain was bound to the Pages site *before* the
DNS records existed, GitHub never created the certificate request — the
`https_certificate` field stayed absent for 30+ minutes while the health
check reported the domain fully valid and eligible. Fix: remove and re-add
the custom domain (API `PUT /pages` with `"cname": null`, then the domain
again). The certificate object appeared immediately and was approved within
a minute.
