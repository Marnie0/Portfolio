-- ============================================================
--  STEP 4 — SINGULAR SECTIONS (Hero / About / Contact)
--  Written as plain DDL (no DO block): the Supabase SQL editor can
--  mis-split dollar-quoted blocks. Safe to re-run.
-- ============================================================

-- One row, enforced by the primary key + check constraint. There is no
-- "visible" flag here: these sections are the page itself, not list items.
create table if not exists public.site_settings (
  id                   integer primary key default 1,
  constraint site_settings_singleton check (id = 1),

  -- Identity
  name                 text not null default '',
  short_name           text not null default '',
  role                 text not null default '',
  tagline              text not null default '',
  description          text not null default '',
  location             text not null default '',
  availability         text not null default '',

  -- Contact details
  email                text not null default '',
  phone_display        text not null default '',
  phone_tel            text not null default '',
  whatsapp_url         text not null default '',
  resume_url           text not null default '/CV.pdf',

  -- Hero button labels
  hero_cta_primary     text not null default 'View work',
  hero_cta_secondary   text not null default 'Contact me',
  hero_resume_label    text not null default 'Résumé',

  -- About section copy
  about_eyebrow        text not null default 'About',
  about_lead           text not null default '',
  about_paragraphs     text[] not null default '{}',

  -- Contact section copy
  contact_eyebrow      text not null default 'Contact',
  contact_title        text not null default '',
  contact_description  text not null default '',

  updated_at           timestamptz not null default now()
);

-- About meta row. `entries` holds one or more lines: a single entry renders
-- inline, several render stacked — exactly how the current design behaves.
-- Named `entries` rather than `values` simply because it reads better;
-- Postgres would accept either.
create table if not exists public.about_facts (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  entries     text[] not null default '{}',
  visible     boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.hero_stats (
  id          uuid primary key default gen_random_uuid(),
  value       text not null,
  label       text not null,
  visible     boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Feeds the hero icons, footer icons, the contact rows and the JSON-LD
-- sameAs list, so adding one here adds it everywhere at once.
create table if not exists public.social_links (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  url         text not null,
  icon        text not null default 'github',
  display     text not null default '',
  visible     boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

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
