-- ============================================================
--  STEP 1 of 3 — TABLES
--  Safe to re-run: every statement is guarded.
-- ============================================================

create table if not exists public.education (
  id           uuid primary key default gen_random_uuid(),
  degree       text not null,
  institution  text not null,
  period       text not null,
  location     text,
  description  text not null default '',
  highlights   text[] not null default '{}',
  visible      boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.skill_groups (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  skills       text[] not null default '{}',
  visible      boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.spoken_languages (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  level        text not null,
  visible      boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.services (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text not null default '',
  deliverables text[] not null default '{}',
  icon         text not null default 'code',
  visible      boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  category     text not null default '',
  year         text not null default '',
  summary      text not null default '',
  focus        text not null default '',
  tech         text[] not null default '{}',
  image_url    text,
  image_alt    text not null default '',
  live_url     text,
  github_url   text,
  featured     boolean not null default false,
  visible      boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.achievements (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  issuer       text not null default '',
  year         text not null default '',
  description  text not null default '',
  type         text not null default '',
  visible      boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
