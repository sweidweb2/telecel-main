-- Collapse legacy Level 1 / Level 2 flags into a single mode enum in jsonb.
-- Keep site_settings KV for upcoming analytics/footer keys.

update public.site_settings
set value = case
  when coalesce((value ->> 'level2')::boolean, false) then '{"mode":"full"}'::jsonb
  when value ->> 'mode' in ('off', 'full') then jsonb_build_object('mode', value ->> 'mode')
  else '{"mode":"off"}'::jsonb
end,
updated_at = now()
where key = 'maintenance';
