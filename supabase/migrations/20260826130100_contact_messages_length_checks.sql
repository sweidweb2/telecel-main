-- Defense-in-depth length bounds aligned with validations/contact-message.ts Zod schema.
alter table public.contact_messages
  add constraint contact_messages_full_name_len_chk
    check (char_length(full_name) between 2 and 100),
  add constraint contact_messages_email_len_chk
    check (char_length(email) between 3 and 254),
  add constraint contact_messages_phone_len_chk
    check (char_length(phone) between 7 and 20),
  add constraint contact_messages_subject_len_chk
    check (char_length(subject) between 2 and 120),
  add constraint contact_messages_message_len_chk
    check (char_length(message) between 20 and 2000);
