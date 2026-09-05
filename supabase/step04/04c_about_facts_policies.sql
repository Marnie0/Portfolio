-- ---------- about_facts ----------
alter table public.about_facts enable row level security;

drop policy if exists "public reads visible" on public.about_facts;
create policy "public reads visible" on public.about_facts
  for select to anon, authenticated using (visible = true);

drop policy if exists "admin reads all" on public.about_facts;
create policy "admin reads all" on public.about_facts
  for select to authenticated using (true);

drop policy if exists "admin inserts" on public.about_facts;
create policy "admin inserts" on public.about_facts
  for insert to authenticated with check (true);

drop policy if exists "admin updates" on public.about_facts;
create policy "admin updates" on public.about_facts
  for update to authenticated using (true) with check (true);

drop policy if exists "admin deletes" on public.about_facts;
create policy "admin deletes" on public.about_facts
  for delete to authenticated using (true);

drop trigger if exists about_facts_set_updated_at on public.about_facts;
create trigger about_facts_set_updated_at before update on public.about_facts
  for each row execute function public.set_updated_at();

create index if not exists about_facts_order_idx on public.about_facts (visible, sort_order);
