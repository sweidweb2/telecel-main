You are creating a Trello card for a Next.js + Supabase enterprise project.
Follow the project's architecture: app/ (routes), actions/ (writes), data/ (reads),
lib/ (infra), types/, validations/ (zod), components/, hooks/, RLS-first Supabase,
performance-first (Server Components, caching, indexes).

Generate ONE Trello card for the following feature/task:

FEATURE: <describe the feature/task here in plain language, include any specific
requirements, edge cases, or constraints I mention>

Output STRICTLY in this format, nothing before or after it:

## Trello Card: <Feature Name>

**Title:**
`<imperative, concise task title>`

**Description:**
<2-4 sentences: what this builds, why it matters, what it depends on or unblocks,
any scope boundaries (what's explicitly NOT included)>

**Acceptance Checklist:**
​```
□ <specific, verifiable item — reference exact file paths/folders matching our
  architecture (app/, actions/, data/, lib/, types/, validations/, components/)>
□ <one item per checkbox — no bundling multiple unrelated things in one line>
□ <group logically if the task is large — DB/migrations first, then actions/data,
  then UI, then error handling, then security/RLS, then testing — but no header
  labels unless the task is complex enough to need sections>
□ <include RLS/security checks if the feature touches any database table>
□ <include at least one automated test