-- Data integrity: blog save atomicity, publish/featured checks, last-admin guard.
-- Also grants service_role INSERT on profiles so createUser can upsert safely.

-- ---------------------------------------------------------------------------
-- blogs: repair rows that would violate the new checks, then add constraints
-- ---------------------------------------------------------------------------

update public.blogs
set is_featured = false
where is_featured = true
  and status is distinct from 'published';

update public.blogs
set published_at = coalesce(published_at, created_at, now())
where status = 'published'
  and published_at is null;

alter table public.blogs
  add constraint blogs_featured_requires_published_chk
  check (not is_featured or status = 'published');

alter table public.blogs
  add constraint blogs_published_requires_published_at_chk
  check (status is distinct from 'published' or published_at is not null);

-- ---------------------------------------------------------------------------
-- Atomic create/update for Insights posts (clear featured + write in one txn)
-- ---------------------------------------------------------------------------

create or replace function public.save_blog(
  p_title text,
  p_slug text,
  p_summary text,
  p_body_html text,
  p_categories text[],
  p_author_name text,
  p_status public.blog_status,
  p_is_featured boolean,
  p_reading_time_minutes integer,
  p_id uuid default null
)
returns table (
  id uuid,
  slug text,
  previous_slug text,
  previous_status public.blog_status
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_is_featured boolean;
  v_published_at timestamptz;
  v_id uuid;
  v_slug text;
  v_previous_slug text;
  v_previous_status public.blog_status;
  v_existing_published_at timestamptz;
begin
  if not public.is_staff() then
    raise exception 'Only staff can save blogs'
      using errcode = '42501';
  end if;

  -- Drafts cannot be featured (matches Zod + blogs_featured_requires_published_chk).
  v_is_featured := coalesce(p_is_featured, false) and p_status = 'published';

  if v_is_featured then
    update public.blogs b
    set is_featured = false
    where b.is_featured = true
      and (p_id is null or b.id is distinct from p_id);
  end if;

  if p_id is null then
    v_published_at := case
      when p_status = 'published' then now()
      else null
    end;

    insert into public.blogs (
      title,
      slug,
      summary,
      body_html,
      categories,
      author_name,
      status,
      is_featured,
      reading_time_minutes,
      published_at
    )
    values (
      p_title,
      p_slug,
      p_summary,
      coalesce(p_body_html, ''),
      coalesce(p_categories, '{}'::text[]),
      p_author_name,
      p_status,
      v_is_featured,
      greatest(coalesce(p_reading_time_minutes, 1), 1),
      v_published_at
    )
    returning blogs.id, blogs.slug into v_id, v_slug;

    return query
    select v_id, v_slug, null::text, null::public.blog_status;
    return;
  end if;

  select b.slug, b.status, b.published_at
  into v_previous_slug, v_previous_status, v_existing_published_at
  from public.blogs b
  where b.id = p_id
  for update;

  if not found then
    raise exception 'Blog not found'
      using errcode = 'P0002';
  end if;

  v_published_at := case
    when p_status = 'published' then coalesce(v_existing_published_at, now())
    else v_existing_published_at
  end;

  update public.blogs b
  set
    title = p_title,
    slug = p_slug,
    summary = p_summary,
    body_html = coalesce(p_body_html, ''),
    categories = coalesce(p_categories, '{}'::text[]),
    author_name = p_author_name,
    status = p_status,
    is_featured = v_is_featured,
    reading_time_minutes = greatest(coalesce(p_reading_time_minutes, 1), 1),
    published_at = v_published_at
  where b.id = p_id
  returning b.id, b.slug into v_id, v_slug;

  return query
  select v_id, v_slug, v_previous_slug, v_previous_status;
end;
$$;

revoke all on function public.save_blog(
  text, text, text, text, text[], text, public.blog_status, boolean, integer, uuid
) from public, anon;

grant execute on function public.save_blog(
  text, text, text, text, text[], text, public.blog_status, boolean, integer, uuid
) to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Last active admin cannot be demoted, suspended, or deleted
-- ---------------------------------------------------------------------------

create or replace function public.assert_not_last_active_admin(target_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (
    select 1
    from public.profiles p
    where p.id = target_id
      and p.role = 'admin'
      and p.is_active
  )
  and not exists (
    select 1
    from public.profiles p
    where p.id is distinct from target_id
      and p.role = 'admin'
      and p.is_active
  ) then
    raise exception 'Cannot remove the last active administrator'
      using errcode = 'P0001';
  end if;
end;
$$;

revoke all on function public.assert_not_last_active_admin(uuid) from public, anon, authenticated;
grant execute on function public.assert_not_last_active_admin(uuid) to service_role;

create or replace function public.protect_profile_access_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (new.role is distinct from old.role or new.is_active is distinct from old.is_active)
     and coalesce(auth.role(), '') <> 'service_role'
     and not public.is_admin() then
    raise exception 'Only administrators can change roles or account status'
      using errcode = '42501';
  end if;

  if new.email is distinct from old.email
     and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Email is managed by Auth'
      using errcode = '42501';
  end if;

  if old.role = 'admin'
     and old.is_active
     and (
       new.role is distinct from 'admin'::public.user_role
       or new.is_active is distinct from true
     ) then
    perform public.assert_not_last_active_admin(old.id);
  end if;

  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.prevent_last_admin_profile_delete()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.assert_not_last_active_admin(old.id);
  return old;
end;
$$;

drop trigger if exists profiles_prevent_last_admin_delete on public.profiles;

create trigger profiles_prevent_last_admin_delete
  before delete on public.profiles
  for each row execute function public.prevent_last_admin_profile_delete();

revoke all on function public.prevent_last_admin_profile_delete() from public, anon, authenticated;

-- Allow Auth Admin createUser compensation / upsert to insert a missing profile.
grant insert on table public.profiles to service_role;
