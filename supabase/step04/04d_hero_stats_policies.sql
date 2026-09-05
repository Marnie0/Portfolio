-- ---------- hero_stats ----------
alter table public.hero_stats enable row level security;

drop policy if exists "public reads visible" on public.hero_stats;
create policy "public reads visible" on public.hero_stats
  for select to anon, authenticated using (visible = true);

drop policy if exists "admin reads all" on public.hero_stats;
create policy "admin reads all" on public.hero_stats
  for select to authenticated using (true);

drop policy if exists "admin inserts" on public.hero_stats;
create policy "admin inserts" on public.hero_stats
  for insert to authenticated with check (true);

drop policy if exists "admin updates" on public.hero_stats;
create policy "admin updates" on public.hero_stats
  for update to authenticated using (true) with check (true);

drop policy if exists "admin deletes" on public.hero_stats;
create policy "admin deletes" on public.hero_stats
  for delete to authenticated using (true);

drop trigger if exists hero_stats_set_updated_at on public.hero_stats;
create trigger hero_stats_set_updated_at before update on public.hero_stats
  for each row execute function public.set_updated_at();

create index if not exists hero_stats_order_idx on public.hero_stats (visible, sort_order);
