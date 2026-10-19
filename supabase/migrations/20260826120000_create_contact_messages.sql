-- Public contact form submissions.
-- Writes go through a Server Action using the service role only.

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

create index contact_messages_email_idx
  on public.contact_messages (email);

alter table public.contact_messages enable row level security;

grant select, insert on table public.contact_messages to service_role;
