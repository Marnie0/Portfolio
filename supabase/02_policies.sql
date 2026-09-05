-- ============================================================
--  STEP 2 of 3 — RLS, POLICIES, TRIGGERS, INDEXES
--
--  Written out statement by statement rather than generated in a
--  DO block: the Supabase SQL editor can mis-split dollar-quoted
--  blocks, and plain DDL removes that whole class of problem.
--  Safe to re-run.
-- ============================================================

-- ---------- education ----------
alter table public.education enable row level security;

drop policy if exists "public reads visible" on public.education;
create policy "public reads visible" on public.education
  for select to anon, authenticated using (visible = true);

drop policy if exists "admin reads all" on public.education;
create policy "admin reads all" on public.education
  for select to authenticated using (true);

drop policy if exists "admin inserts" on public.education;
create policy "admin inserts" on public.education
  for insert to authenticated with check (true);

drop policy if exists "admin updates" on public.education;
create policy "admin updates" on public.education
  for update to authenticated using (true) with check (true);

drop policy if exists "admin deletes" on public.education;
create policy "admin deletes" on public.education
  for delete to authenticated using (true);

drop trigger if exists education_set_updated_at on public.education;
create trigger education_set_updated_at before update on public.education
  for each row execute function public.set_updated_at();

create index if not exists education_order_idx on public.education (visible, sort_order);

-- ---------- skill_groups ----------
alter table public.skill_groups enable row level security;

drop policy if exists "public reads visible" on public.skill_groups;
create policy "public reads visible" on public.skill_groups
  for select to anon, authenticated using (visible = true);

drop policy if exists "admin reads all" on public.skill_groups;
create policy "admin reads all" on public.skill_groups
  for select to authenticated using (true);

drop policy if exists "admin inserts" on public.skill_groups;
create policy "admin inserts" on public.skill_groups
  for insert to authenticated with check (true);

drop policy if exists "admin updates" on public.skill_groups;
create policy "admin updates" on public.skill_groups
  for update to authenticated using (true) with check (true);

drop policy if exists "admin deletes" on public.skill_groups;
create policy "admin deletes" on public.skill_groups
  for delete to authenticated using (true);

drop trigger if exists skill_groups_set_updated_at on public.skill_groups;
create trigger skill_groups_set_updated_at before update on public.skill_groups
  for each row execute function public.set_updated_at();

create index if not exists skill_groups_order_idx on public.skill_groups (visible, sort_order);

-- ---------- spoken_languages ----------
alter table public.spoken_languages enable row level security;

drop policy if exists "public reads visible" on public.spoken_languages;
create policy "public reads visible" on public.spoken_languages
  for select to anon, authenticated using (visible = true);

drop policy if exists "admin reads all" on public.spoken_languages;
create policy "admin reads all" on public.spoken_languages
  for select to authenticated using (true);

drop policy if exists "admin inserts" on public.spoken_languages;
create policy "admin inserts" on public.spoken_languages
  for insert to authenticated with check (true);

drop policy if exists "admin updates" on public.spoken_languages;
create policy "admin updates" on public.spoken_languages
  for update to authenticated using (true) with check (true);

drop policy if exists "admin deletes" on public.spoken_languages;
create policy "admin deletes" on public.spoken_languages
  for delete to authenticated using (true);

drop trigger if exists spoken_languages_set_updated_at on public.spoken_languages;
create trigger spoken_languages_set_updated_at before update on public.spoken_languages
  for each row execute function public.set_updated_at();

create index if not exists spoken_languages_order_idx on public.spoken_languages (visible, sort_order);

-- ---------- services ----------
alter table public.services enable row level security;

drop policy if exists "public reads visible" on public.services;
create policy "public reads visible" on public.services
  for select to anon, authenticated using (visible = true);

drop policy if exists "admin reads all" on public.services;
create policy "admin reads all" on public.services
  for select to authenticated using (true);

drop policy if exists "admin inserts" on public.services;
create policy "admin inserts" on public.services
  for insert to authenticated with check (true);

drop policy if exists "admin updates" on public.services;
create policy "admin updates" on public.services
  for update to authenticated using (true) with check (true);

drop policy if exists "admin deletes" on public.services;
create policy "admin deletes" on public.services
  for delete to authenticated using (true);

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at before update on public.services
  for each row execute function public.set_updated_at();

create index if not exists services_order_idx on public.services (visible, sort_order);

-- ---------- projects ----------
alter table public.projects enable row level security;

drop policy if exists "public reads visible" on public.projects;
create policy "public reads visible" on public.projects
  for select to anon, authenticated using (visible = true);

drop policy if exists "admin reads all" on public.projects;
create policy "admin reads all" on public.projects
  for select to authenticated using (true);

drop policy if exists "admin inserts" on public.projects;
create policy "admin inserts" on public.projects
  for insert to authenticated with check (true);

drop policy if exists "admin updates" on public.projects;
create policy "admin updates" on public.projects
  for update to authenticated using (true) with check (true);

drop policy if exists "admin deletes" on public.projects;
create policy "admin deletes" on public.projects
  for delete to authenticated using (true);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

create index if not exists projects_order_idx on public.projects (visible, sort_order);

-- ---------- achievements ----------
alter table public.achievements enable row level security;

drop policy if exists "public reads visible" on public.achievements;
create policy "public reads visible" on public.achievements
  for select to anon, authenticated using (visible = true);

drop policy if exists "admin reads all" on public.achievements;
create policy "admin reads all" on public.achievements
  for select to authenticated using (true);

drop policy if exists "admin inserts" on public.achievements;
create policy "admin inserts" on public.achievements
  for insert to authenticated with check (true);

drop policy if exists "admin updates" on public.achievements;
create policy "admin updates" on public.achievements
  for update to authenticated using (true) with check (true);

drop policy if exists "admin deletes" on public.achievements;
create policy "admin deletes" on public.achievements
  for delete to authenticated using (true);

drop trigger if exists achievements_set_updated_at on public.achievements;
create trigger achievements_set_updated_at before update on public.achievements
  for each row execute function public.set_updated_at();

create index if not exists achievements_order_idx on public.achievements (visible, sort_order);

-- ---------- storage bucket for project and section images ----------
insert into storage.buckets (id, name, public)
values ('content-images', 'content-images', true)
on conflict (id) do nothing;

drop policy if exists "public reads content images" on storage.objects;
create policy "public reads content images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'content-images');

drop policy if exists "admin uploads content images" on storage.objects;
create policy "admin uploads content images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'content-images');

drop policy if exists "admin deletes content images" on storage.objects;
create policy "admin deletes content images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'content-images');
