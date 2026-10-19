RLS policies from day one — don't leave tables open, write policies as you create each table.
Typed schema — generate TypeScript types with supabase gen types typescript so your queries are type-safe.
Separate environments — different Supabase projects (or at least schemas) for dev/staging/prod.
Never import admin.ts into any file that could end up in a Client Component bundle — a good guard is to only use it inside files under app/api/ or server actions marked 'use server'.