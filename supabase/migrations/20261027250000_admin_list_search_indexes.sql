-- Trgm / filter indexes for admin list search (ilike) and severity filter.
-- pg_trgm already enabled in 20261020090000_baseline_profiles_and_access.sql.

-- Activity log search: action / entity_type / entity_id
create index audit_log_action_trgm_idx
  on public.audit_log using gin (action extensions.gin_trgm_ops);
create index audit_log_entity_type_trgm_idx
  on public.audit_log using gin (entity_type extensions.gin_trgm_ops);
create index audit_log_entity_id_trgm_idx
  on public.audit_log using gin (entity_id extensions.gin_trgm_ops)
  where entity_id is not null;

-- Error log search + severity filter
create index app_errors_source_trgm_idx
  on public.app_errors using gin (source extensions.gin_trgm_ops);
create index app_errors_message_trgm_idx
  on public.app_errors using gin (message extensions.gin_trgm_ops);
create index app_errors_code_trgm_idx
  on public.app_errors using gin (code extensions.gin_trgm_ops)
  where code is not null;
create index app_errors_severity_created_at_idx
  on public.app_errors (severity, created_at desc);

-- Inquiries inbox search
create index inquiries_full_name_trgm_idx
  on public.inquiries using gin (full_name extensions.gin_trgm_ops);
create index inquiries_email_trgm_idx
  on public.inquiries using gin (email extensions.gin_trgm_ops);
create index inquiries_company_trgm_idx
  on public.inquiries using gin (company extensions.gin_trgm_ops);

-- Blogs CMS search (title / slug / author_name)
create index blogs_title_trgm_idx
  on public.blogs using gin (title extensions.gin_trgm_ops);
create index blogs_slug_trgm_idx
  on public.blogs using gin (slug extensions.gin_trgm_ops);
create index blogs_author_name_trgm_idx
  on public.blogs using gin (author_name extensions.gin_trgm_ops);
