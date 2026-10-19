-- One round-trip stats for the admin Users page (replaces 4 head-count queries).

create or replace function public.get_user_stats()
returns table (
  total bigint,
  admins bigint,
  editors bigint,
  viewers bigint,
  new_this_week bigint,
  new_this_month bigint
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    count(*)::bigint as total,
    count(*) filter (where role = 'admin')::bigint as admins,
    count(*) filter (where role = 'editor')::bigint as editors,
    count(*) filter (where role = 'viewer')::bigint as viewers,
    count(*) filter (
      where created_at >= date_trunc('week', timezone('utc', now()))
    )::bigint as new_this_week,
    count(*) filter (
      where created_at >= date_trunc('month', timezone('utc', now()))
    )::bigint as new_this_month
  from public.profiles;
$$;

grant execute on function public.get_user_stats() to authenticated;
