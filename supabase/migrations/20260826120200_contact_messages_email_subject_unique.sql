-- Prevent duplicate contact messages for the same email + subject.
create unique index contact_messages_email_subject_uidx
  on public.contact_messages (lower(email), lower(subject));
