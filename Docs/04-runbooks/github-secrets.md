# GitHub Actions secrets

Every workflow in `.github/workflows/` reads credentials only through
`${{ secrets.NAME }}`. Nothing secret is committed (the repo is public).
Each workflow still runs without its secrets: CI uses placeholders and skips
the Supabase-backed E2E suites, and the preview workflow skips with a notice. Deploy Migrations skips only
when run manually (`workflow_dispatch`); on a push to `main` missing secrets
fail the run so unapplied migrations are never reported green.

Set secrets with the GitHub CLI from the repo root (`gh auth login` first).
`gh secret set NAME` prompts for the value, so it never lands in shell history.

## Secrets by workflow

### CI (`ci.yml`): optional, enables the full E2E run

| Secret | Where to get it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL (use a test/staging project) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page → anon / publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page → service_role key (server only) |
| `E2E_SEED_EMAIL` | Email of the seeded admin user in that project |
| `E2E_SEED_PASSWORD` | Password of that user |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Dashboard → Turnstile → site → Site key (optional) |
| `TURNSTILE_SECRET` | Same site → Secret key (optional) |

Point CI at a **test or staging** Supabase project, never production: the E2E
suites write data.

### Deploy Migrations (`deploy-migrations.yml`): runs on push to `main`

| Secret | Where to get it |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | https://supabase.com/dashboard/account/tokens → Generate new token |
| `SUPABASE_PROJECT_ID` | Project ref: the `<ref>` in `https://supabase.com/dashboard/project/<ref>` |
| `SUPABASE_DB_PASSWORD` | Dashboard → Project Settings → Database → database password (reset it there if unknown) |

### Preview Deploy (`preview.yml`): Vercel preview per same-repo PR

| Secret | Where to get it |
| --- | --- |
| `VERCEL_TOKEN` | https://vercel.com/account/tokens → Create (scope it to the team that owns the project) |
| `VERCEL_ORG_ID` | Run `npx vercel link` locally, then read `orgId` from `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `projectId` in the same file |

The preview build's runtime env (Supabase, Turnstile, `NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_ALLOW_INDEXING=false`, ...) comes from the Vercel project's
**Preview** environment through `vercel pull`. Set it in Vercel → Project →
Settings → Environment Variables, not in GitHub.

## Commands

```sh
# CI (full E2E)
gh secret set NEXT_PUBLIC_SUPABASE_URL
gh secret set NEXT_PUBLIC_SUPABASE_ANON_KEY
gh secret set SUPABASE_SERVICE_ROLE_KEY
gh secret set E2E_SEED_EMAIL
gh secret set E2E_SEED_PASSWORD
gh secret set NEXT_PUBLIC_TURNSTILE_SITE_KEY   # optional
gh secret set TURNSTILE_SECRET                 # optional

# Migrations
gh secret set SUPABASE_ACCESS_TOKEN
gh secret set SUPABASE_PROJECT_ID
gh secret set SUPABASE_DB_PASSWORD

# Vercel previews
gh secret set VERCEL_TOKEN
gh secret set VERCEL_ORG_ID
gh secret set VERCEL_PROJECT_ID

# Check what is set (names only, values are never shown)
gh secret list
```

## Hardening already in place

- Every workflow sets `permissions: contents: read` (least privilege).
- Third-party actions are pinned to commit SHAs (tag kept in a comment); the
  Supabase CLI version is pinned too. Dependabot or a manual bump updates them.
- `actions/checkout` uses `persist-credentials: false`, so the `GITHUB_TOKEN`
  is not left in `.git/config` for later steps.
- Concurrency groups cancel superseded CI and preview runs; migration deploys
  queue instead of cancelling.
- Fork PRs receive no secrets; the preview job skips them.

## Rotating

Generate the new value at the source, run `gh secret set NAME` again, then
revoke the old token. Re-run the latest workflow to confirm.
