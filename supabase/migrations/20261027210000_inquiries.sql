-- Public contact / sales inquiries (RFQ §4.4).
-- Inserts only via service-role server action (Turnstile + rate limit + Zod).
-- Staff (admin + editor) read and update status; anon has no table access.
-- Recipient-group routing ships in a later migration.

create type public.inquiry_intent as enum ('sales', 'demo', 'general');
create type public.inquiry_status as enum (
  'new',
  'contacted',
  'qualified',
  'closed',
  'spam'
);
create type public.contact_method as enum ('email', 'phone', 'video_call');
create type public.delivery_status as enum ('pending', 'sent', 'failed');

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  intent public.inquiry_intent not null,
  full_name text not null,
  company text not null,
  job_role text not null,
  email text not null,
  country_code char(2) not null,
  area_of_interest text not null,
  business_need text not null,
  preferred_contact_method public.contact_method not null,
  consent boolean not null,
  consent_text_version text not null,
  source_path text,
  utm jsonb,
  status public.inquiry_status not null default 'new',
  delivery_status public.delivery_status not null default 'pending',
  delivery_attempts integer not null default 0,
  last_delivery_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint inquiries_consent_true_chk check (consent = true),
  constraint inquiries_full_name_len_chk check (char_length(full_name) between 1 and 120),
  constraint inquiries_company_len_chk check (char_length(company) between 1 and 160),
  constraint inquiries_job_role_len_chk check (char_length(job_role) between 1 and 120),
  constraint inquiries_email_len_chk check (char_length(email) between 3 and 254),
  constraint inquiries_country_code_chk check (country_code ~ '^[A-Z]{2}$'),
  constraint inquiries_area_of_interest_len_chk check (
    char_length(area_of_interest) between 1 and 80
  ),
  constraint inquiries_business_need_len_chk check (
    char_length(business_need) between 1 and 4000
  ),
  constraint inquiries_consent_text_version_len_chk check (
    char_length(consent_text_version) between 1 and 64
  ),
  constraint inquiries_source_path_len_chk check (
    source_path is null or char_length(source_path) between 1 and 300
  ),
  constraint inquiries_delivery_attempts_chk check (delivery_attempts >= 0),
  constraint inquiries_last_delivery_error_len_chk check (
    last_delivery_error is null or char_length(last_delivery_error) between 1 and 2000
  )
);

create index inquiries_created_at_idx on public.inquiries (created_at desc);
create index inquiries_status_created_at_idx
  on public.inquiries (status, created_at desc);
create index inquiries_area_of_interest_idx on public.inquiries (area_of_interest);
create index inquiries_delivery_status_idx
  on public.inquiries (delivery_status)
  where delivery_status <> 'sent';

create trigger inquiries_set_updated_at
  before update on public.inquiries
  for each row execute function public.set_updated_at();

alter table public.inquiries enable row level security;

grant select, update on table public.inquiries to authenticated;
grant select, insert, update, delete on table public.inquiries to service_role;

create policy "Staff can read inquiries"
  on public.inquiries for select to authenticated
  using ((select public.is_staff()));

create policy "Staff can update inquiries"
  on public.inquiries for update to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));
