-- Append-only activity (audit_log) and operational error (app_errors) tables.
-- Admins read via RLS; inserts go through the service-role client in actions/.

create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  summary jsonb,
  created_at timestamptz not null default now(),
  constraint audit_log_action_len_chk check (char_length(action) between 1 and 64),
  constraint audit_log_entity_type_len_chk check (char_length(entity_type) between 1 and 64),
  constraint audit_log_entity_id_len_chk check (
    entity_id is null or char_length(entity_id) between 1 and 128
  )
);

create index audit_log_created_at_idx on public.audit_log (created_at desc);
create index audit_log_entity_idx on public.audit_log (entity_type, entity_id, created_at desc);
create index audit_log_actor_idx on public.audit_log (actor_id, created_at desc);

create table public.app_errors (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  severity text not null,
  source text not null,
  code text,
  message text not null,
  actor_id uuid references public.profiles (id) on delete set null,
  request_id text,
  context jsonb,
  constraint app_errors_severity_chk check (severity in ('warning', 'error')),
  constraint app_errors_source_len_chk check (char_length(source) between 1 and 160),
  constraint app_errors_message_len_chk check (char_length(message) between 1 and 2000),
  constraint app_errors_code_len_chk check (
    code is null or char_length(code) between 1 and 120
  ),
  constraint app_errors_request_id_len_chk check (
    request_id is null or char_length(request_id) between 1 and 120
  )
);

create index app_errors_created_at_idx on public.app_errors (created_at desc);
create index app_errors_source_idx on public.app_errors (source, created_at desc);

alter table public.audit_log enable row level security;
alter table public.app_errors enable row level security;

grant select on table public.audit_log to authenticated;
grant select, insert on table public.audit_log to service_role;

grant select on table public.app_errors to authenticated;
grant select, insert on table public.app_errors to service_role;

create policy "Admins can read audit_log"
  on public.audit_log for select to authenticated
  using ((select public.is_admin()));

create policy "Admins can read app_errors"
  on public.app_errors for select to authenticated
  using ((select public.is_admin()));
