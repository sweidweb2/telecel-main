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
│   ├── libraries.md                Approved dependencies
│   └── design-system.md            "Connected Energies" UI system
├── 03-database/
│   ├── schema.dbml              Full Phase 1 data model (migrated + draft tables)
│   └── supabase-functions.md    RPCs, triggers, role helpers (is_admin, etc.)
├── 04-runbooks/
│   ├── environment.md  Env vars, secrets sharing, commands, migrations
│   └── auth-setup.md   Hosted Auth, first admin, Google, password reset, 24h sessions
├── optimization/
│   └── lightweight-stack.md  Keep / cut / replace deps to slim the app
├── 05-branch-review/   Local-branch review reports (observability + polish)
│   └── README.md       Index of architecture / performance / security / smells
└── client/             (git-ignored) RFQ, text pack, brand assets
```

Conventions: one topic per file, decisions dated, and the RFQ section cited when it drives a requirement. Keep `schema.dbml` in sync with `supabase/migrations/` in the same PR.
