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
| E2E (starts dev server locally) | `npx playwright install chromium` once, then `npm run test:e2e` |
| Full local CI mirror | `npm run test:ci` (lint → typecheck → vitest → build → Playwright) |
| Link a hosted project | `npx supabase link --project-ref <ref>` (once per machine) |
| Push migrations to linked remote | `npm run db:migrate:remote` (`supabase db push`; CI also does this on merge to `main`) |
| Regenerate DB types | `npm run db:types` |

## Migrations

- `supabase/migrations/` is append-only **once applied anywhere**. Telecel Global started from a fresh baseline on 2026-10-20.
- After the first `db push` to a Telecel project, never edit a merged migration. Add a new one instead.
- **Deploy order:** apply migrations **before** (or in the same release gate as) the app build that depends on them. Blog create/update requires `save_blog()` (`20261122060000_blog_save_rpc_and_integrity`). Shipping the Next app first yields hard CMS failures (`function save_blog does not exist`).
- After a successful remote push that adds/changes RPCs or tables, run `npm run db:types` and commit `types/database.ts`. Do not hand-edit that file.
- `supabase/seed.sql` is **local only**. The GitHub migration workflow never runs it.
- **Last active admin:** demoting, suspending, or deleting the only active admin is blocked in the database. Keep at least two admins in staging/prod, or create a second admin before removing the first. Local `db:reset` still works because seed inserts a fresh admin into an empty DB.

## Scheduled backups

`vercel.json` registers a daily Vercel Cron (`0 2 * * *`, UTC) hitting `GET /api/cron/backup`. The route:

1. Rejects anything without `Authorization: Bearer $CRON_SECRET` (401; an unset secret denies everything).
2. Streams every table in `constants/backup-tables.ts` from the keyset loop into compact JSON parts, `scheduled/<stamp>/<table>.<NNNN>.json` (a new part every 20k rows or ~20MB), then writes `manifest.json` listing the parts, in the private Supabase Storage bucket `backups` (migration `20261122090000`, no RLS policies, so service role only).
3. Deletes run folders older than `BACKUP_RETENTION_DAYS` (default 30) and manual export folders (`manual/<stamp>/`) older than 7 days.
4. Logs success/failure to the activity log (`entity_type = scheduled_backup`) and failures to the error log (`source = api.cron.backup`).

Admins see the last run and stored files under **Scheduled backups** on `/dashboard/backups`; downloads use 60-second signed URLs. The route is exempt from maintenance mode.

| Env var | Where | Notes |
| --- | --- | --- |
| `CRON_SECRET` | Vercel project env (Production) | Random 32+ byte string. Vercel adds the bearer header automatically. |
| `BACKUP_RETENTION_DAYS` | Vercel project env | Optional, positive integer, default 30. |

Manual test: `curl -H "Authorization: Bearer $CRON_SECRET" https://<host>/api/cron/backup`.
Storage is behind `BackupStorageAdapter` (`lib/scheduled-backup.ts`, Supabase impl in `lib/backup-storage.ts`); swap `getBackupStorage()` to move to S3 or similar. Vercel Hobby plans allow daily crons only.

Manual exports on `/dashboard/backups` are uploaded to `manual/<stamp>/` in the same bucket and downloaded through 5-minute signed URLs.

### Known limitations

- Table exports (manual and scheduled) are not a single transactional snapshot: each table is paged separately by primary key, so rows written while an export runs may or may not appear, and related tables can be slightly out of sync. Use Supabase point-in-time recovery / database backups when you need a consistent snapshot.

## CI secrets (GitHub → Settings → Secrets)

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `E2E_SEED_EMAIL`, `E2E_SEED_PASSWORD` (CI E2E), and `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_ID`, `SUPABASE_DB_PASSWORD` (migration deploy). Without them, CI still runs lint/types/unit/build/public E2E; auth, blogs, users, and observability E2E suites skip themselves.

Apply `supabase/migrations/` (including `audit_log` / `app_errors` / `save_blog`) to the project used for E2E before expecting those suites to pass.
