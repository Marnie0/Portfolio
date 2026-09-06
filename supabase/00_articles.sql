-- ============================================================
--  STEP 0 — ARTICLES (run this first)
--
--  This is the migration that created the blog. It defines
--  public.set_updated_at(), which every later migration reuses,
--  so it must run before 02_policies.sql and 04_site_schema.sql.
--
--  Reconstructed and committed after the fact: the original was
--  applied straight from the Supabase SQL editor and never made
--  it into the repo. Verified column-by-column against the live
--  table. Safe to re-run.
-- ============================================================

create table if not exists public.articles (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  excerpt         text,
  content         text not null default '',
  cover_image_url text,
  published       boolean not null default false,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists articles_published_idx
  on public.articles (published, published_at desc);

-- Shared by every table in this schema; defined here because articles was
-- the first migration.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

-- ---------- RLS ----------
alter table public.articles enable row level security;

-- Anonymous visitors see published articles only. Drafts are invisible even
-- if the slug is guessed, because the database itself refuses to return them.
drop policy if exists "public reads published articles" on public.articles;
create policy "public reads published articles" on public.articles
  for select to anon, authenticated using (published = true);

drop policy if exists "admin reads all articles" on public.articles;
create policy "admin reads all articles" on public.articles
  for select to authenticated using (true);

drop policy if exists "admin inserts articles" on public.articles;
create policy "admin inserts articles" on public.articles
  for insert to authenticated with check (true);

drop policy if exists "admin updates articles" on public.articles;
create policy "admin updates articles" on public.articles
  for update to authenticated using (true) with check (true);

drop policy if exists "admin deletes articles" on public.articles;
create policy "admin deletes articles" on public.articles
  for delete to authenticated using (true);

-- ---------- storage bucket for article images ----------
insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true)
on conflict (id) do nothing;

drop policy if exists "public reads article images" on storage.objects;
create policy "public reads article images" on storage.objects
  for select to anon, authenticated using (bucket_id = 'article-images');

drop policy if exists "admin uploads article images" on storage.objects;
create policy "admin uploads article images" on storage.objects
  for insert to authenticated with check (bucket_id = 'article-images');

drop policy if exists "admin deletes article images" on storage.objects;
create policy "admin deletes article images" on storage.objects
  for delete to authenticated using (bucket_id = 'article-images');
