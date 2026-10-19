-- Prevent duplicate interest registrations for the same email + company.
create unique index interest_registrations_email_company_uidx
  on public.interest_registrations (lower(email), lower(company_name));
