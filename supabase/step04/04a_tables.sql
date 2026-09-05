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
