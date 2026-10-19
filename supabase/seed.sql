-- Local development seed data belongs here.
-- Keep production data and credentials out of this file.
--
-- Seeds a confirmed admin for dashboard testing:
-- email: asweid657@gmail.com
-- password: ali@1234

create extension if not exists pgcrypto with schema extensions;

do $$
declare
  seed_user_id uuid := gen_random_uuid();
  seed_email text := 'asweid657@gmail.com';
  seed_password text := 'ali@1234';
begin
  if exists (select 1 from auth.users where email = seed_email) then
    return;
  end if;

  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  values (
    '00000000-0000-0000-0000-000000000000',
    seed_user_id,
    'authenticated',
    'authenticated',
    seed_email,
    extensions.crypt(seed_password, extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"ASIP Admin"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  values (
    gen_random_uuid(),
    seed_user_id,
    jsonb_build_object(
      'sub', seed_user_id::text,
      'email', seed_email,
      'email_verified', true
    ),
    'email',
    seed_user_id::text,
    now(),
    now(),
    now()
  );
end;
$$;
