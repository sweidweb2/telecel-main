-- List/filter indexes for CMS blogs, inquiry inbox intent filters, and
-- app_errors actor lookups. Complements public blogs (status, published_at)
-- and inquiries (status, created_at) indexes from earlier migrations.

create index blogs_status_created_at_idx
  on public.blogs (status, created_at desc, id);

create index inquiries_intent_status_created_at_idx
  on public.inquiries (intent, status, created_at desc);

create index app_errors_actor_idx
  on public.app_errors (actor_id, created_at desc);
