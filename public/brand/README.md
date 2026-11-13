Official Telecel artwork lives here locally and is git-ignored (confidential
until Telecel approves publishing; the repo is public).

Drop in (or regenerate) these files:

| File | Use |
| --- | --- |
| `telecel-wordmark.png` | Horizontal lockup in nav, footer, auth, CMS sidebar |
| `telecel-mark.png` | Circular red “t” mark (no wordmark) — source for favicons |
| `telecel-mark-512.png` | Larger mark export |

`next.config.ts` turns on `NEXT_PUBLIC_HAS_BRAND_LOGO` when `telecel-wordmark.png` exists.

Favicons (`app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`) are the mark only
and are also git-ignored. Restart `next dev` after adding or replacing brand files.

Source pack (local): `Docs/05-about project/TELECEL GLOBAL LOGO HORIZONTAL PNG.png`
and the stacked variant for a clean mark crop.
