-- ---------- site_settings (no visible flag: it IS the page) ----------
alter table public.site_settings enable row level security;

drop policy if exists "public reads settings" on public.site_settings;
create policy "public reads settings" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "admin inserts settings" on public.site_settings;
create policy "admin inserts settings" on public.site_settings
  for insert to authenticated with check (true);

drop policy if exists "admin updates settings" on public.site_settings;
create policy "admin updates settings" on public.site_settings
  for update to authenticated using (true) with check (true);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();
