# Editor portal — feature definition (draft for team review)

Board card: *Define what features we need for the editor portal*. Derived from
the Telecel Global RFQ (§3, §4.2, §4.4, §5). The navigation lives in
`constants/dashboard-nav.ts`; every item below already has a route and a
role-gated placeholder page. The tables are drafted in `docs/03-database/schema.dbml`.

## Roles (RFQ §5 "named admin/editor roles")

| Capability | Editor | Admin |
| --- | --- | --- |
| Website content (pages, services, solutions, use cases, news, case studies, leadership, partners, CTAs, media) | ✅ | ✅ |
| Inquiries: read, update status, export | ✅ | ✅ |
| SEO & redirects | ✅ | ✅ |
| Users: invite, change role, suspend, delete | — | ✅ |
| Activity log (CMS mutations, append-only) | — | ✅ |
| Error log (unexpected server failures) | — | ✅ |
| Form routing (recipient groups and rules) | — | ✅ |
| Site settings (analytics IDs, footer, social, privacy/cookie wording) | — | ✅ |
| Backups (status and recovery runbook) | — | ✅ |

Accounts without a role, or suspended accounts, cannot sign in to the CMS.

## Sections and Phase 1 features

**Must have for launch** (directly required by the RFQ acceptance criteria):

1. **Pages**: Home, Platform and Why Telecel Global, built from reorderable sections (hero, service pillars, outcomes, buyer routes, delivery model, proof, CTA, rich text, media). Draft/publish, per-page SEO fields, social image.
2. **Services**: 5 pillar pages, each with ordered sub-service modules. A module can be promoted to a standalone page (`is_standalone_page`) without redesign.
3. **Solutions**: 4 pages with linked pillars and use cases.
4. **Use cases**: 6 pages with linked pillars and solutions.
5. **News** (Insights): already working: rich text, cover image, author, categories, featured article, draft/publish. Migrate up to 15 existing items.
6. **Leadership**: profiles with photo, title, bio and manual ordering.
7. **CTAs**: Talk to Sales and Request a Demo blocks, edited once and reused everywhere, each with a stable analytics event name.
8. **Media library**: upload with type/size checks, **required alt text**, hero video with poster image.
9. **Inquiries**: list, filter, status, CSV export, routing and delivery status per inquiry.
10. **Form routing** (admin): recipient groups and routing rules by area of interest and intent. No code changes needed.
11. **SEO & redirects**: redirect manager, sitemap/noindex controls.
12. **Site settings** (admin): tag manager ID, footer/social links, privacy and cookie wording.
13. **Users** (admin): already working. Invite, role, suspend, delete.

**When approved by Telecel:**

14. **Case studies**: publish only with `is_approved`.
15. **Partners & ecosystem**: publish only with `is_cleared`.

**Cross-cutting:**

- Preview before publish. Every publish/unpublish revalidates the detail page, listings and `sitemap.xml`.
- Activity log (`audit_log`) of create/update/publish/delete and role changes (admin-readable, append-only) at `/dashboard/activity-log`.
- Error log (`app_errors`) for unexpected Server Action / provider failures at `/dashboard/error-log` (not validation/authz noise; not a third-party APM).
- Optimistic concurrency (warn when someone else saved first).
- No placeholder or invented content may be published (RFQ §4.3). The portal should show "missing content" warnings.

**Out of scope for Phase 1** (priced separately in the RFQ): multilingual content, advanced animation, founder or investor portals.

## Questions for the team

1. Do we need an approval step (editor drafts → admin publishes), or can editors publish directly? The RFQ doesn't say.
2. Does inquiry email delivery go through Telecel's SMTP, or a provider we set up (Brevo/Resend)?
3. Which analytics/tag manager does Telecel use? (Needed for event names.)
4. Is CSV export of inquiries allowed under Telecel's privacy policy?
