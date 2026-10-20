# Telecel Global — project docs

Technical, non-confidential documentation lives here and is committed.
**The GitHub repo is public:** client material (the RFQ, text pack, brand files, credentials) goes in `docs/client/`, which git ignores (see `docs/client/README.md`).

```
docs/
├── 01-tasks/           Board cards: specs and status
│   └── backlog-status.md
├── 02-architecture/    Decisions and designs
│   ├── foundation-plan.md          Plan for the setup cards (+ Codex review)
│   ├── editor-portal-features.md   Editor/admin portal scope and roles
│   └── libraries.md                Approved dependencies
├── 03-database/
│   └── schema.dbml     Full Phase 1 data model (migrated + draft tables)
├── 04-runbooks/
│   ├── environment.md  Env vars, secrets sharing, commands, migrations
│   └── auth-setup.md   Hosted Auth, first admin, Google, password reset, 24h sessions
└── client/             (git-ignored) RFQ, text pack, brand assets
```

Conventions: one topic per file, decisions dated, and the RFQ section cited when it drives a requirement. Keep `schema.dbml` in sync with `supabase/migrations/` in the same PR.
