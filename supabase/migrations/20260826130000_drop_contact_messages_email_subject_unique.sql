-- Allow follow-up contact messages with the same email + subject.
-- Spam is throttled by app rate limits and admin moderation.
drop index if exists public.contact_messages_email_subject_uidx;
