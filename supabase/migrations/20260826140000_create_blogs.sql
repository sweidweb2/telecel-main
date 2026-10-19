-- Public insights / blog posts (English-only phase 1).
-- Admins manage via session client; published rows are readable by anon.

create type public.blog_status as enum ('draft', 'published');

create table public.blogs (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  summary text not null,
  body_html text not null default '',
  categories text[] not null default '{}'::text[],
  thumbnail_url text,
  author_name text not null,
  author_avatar_url text,
  status public.blog_status not null default 'draft',
  is_featured boolean not null default false,
  reading_time_minutes integer not null default 1,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blogs_slug_len_chk check (
    char_length(slug) between 2 and 120
  ),
  constraint blogs_title_len_chk check (
    char_length(title) between 2 and 200
  ),
  constraint blogs_summary_len_chk check (
    char_length(summary) between 2 and 500
  ),
  constraint blogs_author_name_len_chk check (
    char_length(author_name) between 2 and 100
  ),
  constraint blogs_reading_time_chk check (reading_time_minutes >= 1),
  constraint blogs_slug_format_chk check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create unique index blogs_slug_uidx on public.blogs (slug);

create unique index blogs_one_featured_uidx
  on public.blogs (is_featured)
  where is_featured = true;

create index blogs_status_published_at_idx
  on public.blogs (status, published_at desc nulls last);

create index blogs_created_at_idx
  on public.blogs (created_at desc);

create index blogs_categories_gin_idx
  on public.blogs using gin (categories);

create or replace function public.set_blogs_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger blogs_set_updated_at
  before update on public.blogs
  for each row
  execute function public.set_blogs_updated_at();

alter table public.blogs enable row level security;

grant select on table public.blogs to anon, authenticated;
grant insert, update, delete on table public.blogs to authenticated;
grant select, insert, update, delete on table public.blogs to service_role;

create policy "Anyone can read published blogs"
  on public.blogs
  for select
  to anon, authenticated
  using (status = 'published');

create policy "Admins can read all blogs"
  on public.blogs
  for select
  to authenticated
  using (public.is_admin());

create policy "Admins can insert blogs"
  on public.blogs
  for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins can update blogs"
  on public.blogs
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete blogs"
  on public.blogs
  for delete
  to authenticated
  using (public.is_admin());
