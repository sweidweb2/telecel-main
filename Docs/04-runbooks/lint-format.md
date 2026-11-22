# Lint, format, types, and pre-commit

Stack: **Prettier** (format) · **ESLint** (bugs/patterns) · **strict TypeScript** · **Husky** + **lint-staged** (git hooks).

They do different jobs — use all of them. Do not use one as a substitute for another.

## Commands

| Task | Command |
| --- | --- |
| Format whole repo | `npm run format` |
| Check formatting (CI) | `npm run format:check` |
| Lint | `npm run lint` |
| Lint + auto-fix | `npm run lint:fix` |
| Typecheck (`strict`) | `npm run typecheck` |
| Full CI mirror | `npm run test:ci` |
| Pre-commit (manual) | `npx lint-staged` |

## What runs on commit

Husky `.husky/pre-commit` runs `npx lint-staged`:

| Staged files | Actions |
| --- | --- |
| `*.{js,jsx,ts,tsx,mjs,cjs}` | `eslint --fix --max-warnings=0` then `prettier --write` |
| `*.{json,md,css,scss,yml,yaml,html}` | `prettier --write` |

If ESLint reports errors/warnings or Prettier fails, the commit is blocked. Fix, re-stage, commit again.

## Conventions

- **Prettier owns style** (quotes, semis, wrapping). Do not fight it with ESLint style rules — `eslint-config-prettier` turns those off.
- **ESLint owns correctness** (unused vars, hooks, Next rules). Prefer fixing the code over disabling rules; if you must disable, use a narrow `eslint-disable-next-line` with a reason.
- **TypeScript stays `strict: true`** in `tsconfig.json`. Do not weaken it (`any` escapes, `@ts-ignore`) without a documented reason.
- **Format on staged files via the hook** day-to-day. Use `npm run format` only when you intentionally want a repo-wide format pass (expect a large diff).
- Config lives in: `.prettierrc`, `.prettierignore`, `eslint.config.mjs`, `package.json` → `lint-staged`, `.husky/pre-commit`.

## One-time / new clone

```bash
npm ci          # runs prepare → husky
```

Confirm hooks: `git config core.hooksPath` should be `.husky/_`.
