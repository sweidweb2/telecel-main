# Environment and commands

## Environments

| Env | URL | Supabase project | Indexing |
| --- | --- | --- | --- |
| Local | http://localhost:3000 | your own or local CLI stack | off |
| Staging/UAT | TBD | `telecel-global-staging` | `NEXT_PUBLIC_ALLOW_INDEXING=false` |
| Production | TBD (Telecel domain) | `telecel-global-prod` | on |

RFQ §4.2 asks for staging, UAT and production processes. Use separate Supabase projects for staging and production, so test data and auth users never mix.

## Setting up `.env.local`

1. `cp .env.example .env.local`
2. Fill in the Supabase URL and keys from Dashboard → Project Settings → API.
3. **Sharing secrets:** use the team password manager (one shared vault item per environment). Never use chat, email, git or screenshots. The repo is **public**.
4. Rotate the service-role key if it is ever exposed.

## Commands

| Task | Command |
| --- | --- |
| Install | `npm ci` |
| Dev server | `npm run dev` |
| Lint / types / unit tests | `npm run lint` · `npm run typecheck` · `npm test` |
| Production build | `npm run build` |
| E2E (starts dev server) | `npx playwright install chromium` once, then `npm run test:e2e` |
| Local Supabase (needs Docker) | `npx supabase start` → `npx supabase db reset` (applies migrations + seed) |
| Link a hosted project | `npx supabase link --project-ref <ref>` |
| Push migrations | `npx supabase db push` (CI does this on merge to `main`; see `.github/workflows/deploy-migrations.yml`) |
| Regenerate DB types | `npx supabase gen types typescript --linked > types/database.ts` |

## Migrations

- `supabase/migrations/` is append-only **once applied anywhere**. The ASIP history was replaced by a fresh baseline on 2026-10-20, before any Telecel project existed.
- After the first `db push` to a Telecel project, never edit a merged migration. Add a new one instead.
- `types/database.ts` was hand-updated for the baseline. Regenerate it after linking the first project and commit the result.

## CI secrets (GitHub → Settings → Secrets)

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `E2E_SEED_EMAIL`, `E2E_SEED_PASSWORD` (CI E2E), and `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_ID`, `SUPABASE_DB_PASSWORD` (migration deploy). Without them, CI still runs lint/types/unit/build, and the auth E2E tests skip themselves.
