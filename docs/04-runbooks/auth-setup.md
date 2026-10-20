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

## 5. Password reset without our own domain email (board card research)

**Finding:** Supabase's built-in email service only delivers to the project's **team members** and is limited to a few emails per hour. It isn't usable for real users, whatever the domain. Password reset needs a custom SMTP server (Authentication → Emails → SMTP Settings).

Options **without owning a sending domain**:

| Option | Domain needed? | Notes |
| --- | --- | --- |
| **Brevo (Sendinblue) SMTP** | No (single verified sender address) | Free tier is about 300 emails/day. Fastest to set up. Deliverability is fine for low-volume transactional mail. |
| **Gmail / Google Workspace SMTP** | No | `smtp.gmail.com:587` with an app password (needs 2FA). About 500/day on personal accounts, 2,000/day on Workspace. Sender is the Gmail address. |
| **Telecel's own SMTP / M365 relay** | Uses Telecel's domain | Best for production branding. Needs Telecel IT. |
| Resend, Postmark, SES | **Yes** (DNS verification) | Best deliverability, but needs DNS access to a domain. |

**Recommendation:** use Brevo or Gmail SMTP for staging and UAT now, and switch to Telecel's SMTP or a domain-verified provider before launch (RFQ: secure, no vendor lock-in).

**No-email fallback (works today):** an admin sets a new strong temporary password for the user in the Users portal and shares it securely. The user then changes it from the account menu → *Change password*.

How the flow works in the app:
`/forgot-password` → `resetPasswordForEmail` (always shows the same reply, rate-limited) → email link to `/auth/confirm?token_hash=…&type=recovery` (works on any device, single use, 1h) → `/update-password` → other sessions are signed out.

**Required:** set the hosted email templates (Authentication → Emails → Templates) to the contents of `supabase/templates/recovery.html` and `invite.html`. The default templates use a PKCE link that only works in the browser that asked for the reset.
