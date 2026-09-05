-- ---------- social_links ----------
alter table public.social_links enable row level security;

drop policy if exists "public reads visible" on public.social_links;
create policy "public reads visible" on public.social_links
  for select to anon, authenticated using (visible = true);

drop policy if exists "admin reads all" on public.social_links;
create policy "admin reads all" on public.social_links
  for select to authenticated using (true);

drop policy if exists "admin inserts" on public.social_links;
create policy "admin inserts" on public.social_links
  for insert to authenticated with check (true);

drop policy if exists "admin updates" on public.social_links;
create policy "admin updates" on public.social_links
  for update to authenticated using (true) with check (true);

drop policy if exists "admin deletes" on public.social_links;
create policy "admin deletes" on public.social_links
  for delete to authenticated using (true);

drop trigger if exists social_links_set_updated_at on public.social_links;
create trigger social_links_set_updated_at before update on public.social_links
  for each row execute function public.set_updated_at();

create index if not exists social_links_order_idx on public.social_links (visible, sort_order);
