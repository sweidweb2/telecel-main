# Auth setup (hosted Supabase)

`supabase/config.toml` only configures the **local** CLI stack. Apply the
settings below in the hosted project dashboard for staging and production.

## 1. Core settings (Authentication → Sign In / Providers)

- **Allow new users to sign up: OFF.** The CMS is invite-only. Admins create users from **Dashboard → Users** (Auth Admin API). This also stops Google OAuth from creating accounts for unknown Google users. Disabling *email* signups alone is **not** enough.
- Minimum password length 10, with lower case, upper case and digits (matches `validations/auth.ts`).
- **URL configuration:** Site URL = `NEXT_PUBLIC_SITE_URL`. Redirect URLs:
  `https://<domain>/auth/callback`, `https://<domain>/auth/confirm`, `https://<domain>/update-password`.

## 2. First admin (bootstrap)

The CMS can only create users once an admin exists. For the first one:

1. Dashboard → Authentication → Users → **Add user** (email + strong password, auto-confirm).
2. SQL editor:
   ```sql
   update auth.users set raw_app_meta_data = raw_app_meta_data || '{"app_role":"admin"}'
   where email = 'first.admin@telecel.com';
   update public.profiles set role = 'admin' where email = 'first.admin@telecel.com';
   ```
3. That admin creates everyone else in the Users portal.

## 3. Session timeout: 1 day (board card)

- **Enforced by the app on every plan:** `public.current_session_is_fresh()` compares `auth.sessions.created_at` (fixed at sign-in, unchanged on refresh) with `now() - 24h`. Every staff/admin RLS check and every CMS page/action guard uses it, so direct Supabase API calls stop working after 24 hours too. Expired users are signed out and see "Your session expired after 24 hours".
- **Pro plan (optional, belt and braces):** Authentication → Sessions → *Time-box user sessions* = 24h. Supabase then also stops refreshing the session.

## 4. Google login (board card)

1. Google Cloud Console → APIs & Services → Credentials → **OAuth client ID** (Web application).
   - Authorized JavaScript origins: `https://<domain>` (and `http://localhost:3000` for dev).
   - Authorized redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`.
   - OAuth consent screen: *Internal* if Telecel uses Google Workspace, otherwise *External* with a test-user list.
2. Supabase → Authentication → Providers → **Google**: paste the client ID and secret, then enable it.
3. Set `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true` and redeploy.
4. Behaviour: only users an admin already created can sign in with Google. Supabase links the Google identity to the existing account when the emails match and are verified. An unknown Google account is rejected and the user lands on `/login?reason=auth-error`.

## 5. Password help (self-serve email reset deferred)

Self-serve “Forgot password” email reset is **not** in the product UI. Login links
**Forgot password? Contact us** → `/contact?intent=general`. Staff handle the
request from **Dashboard → Inquiries** (or set a temporary password in Users).

**Works today without SMTP:**

1. User submits the public contact form (or an admin is reached out of band).
2. Admin sets a strong temporary password in **Dashboard → Users** and shares it securely.
3. User signs in and changes it from the account menu → *Change password*
   (`/update-password`).

**Invite links** still use `/auth/confirm` + `/update-password` when email invites
are enabled. If you turn invites on later, set the hosted invite template to
`supabase/templates/invite.html` and configure custom SMTP (built-in Supabase
mail only reaches project team members).

Legacy `/forgot-password` redirects to `/contact?intent=general`.
