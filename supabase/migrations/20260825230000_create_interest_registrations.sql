-- Public register-interest / apply submissions.
-- Writes go through a Server Action using the service role only.
-- No anon/authenticated table grants — PostgREST cannot insert with the anon key.

create table public.interest_registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  company_name text not null,
  sector text not null,
  country text not null,
  pitch text not null,
  consent boolean not null,
  created_at timestamptz not null default now(),
  constraint interest_registrations_consent_true check (consent = true)
);

create index interest_registrations_created_at_idx
  on public.interest_registrations (created_at desc);

create index interest_registrations_email_idx
  on public.interest_registrations (email);

alter table public.interest_registrations enable row level security;

grant select, insert on table public.interest_registrations to service_role;
