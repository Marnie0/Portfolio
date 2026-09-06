-- ============================================================
--  STEP 7 — Pinned articles
--  One column. Safe to re-run.
-- ============================================================

alter table public.articles
  add column if not exists pinned boolean not null default false;

-- The public list sorts pinned first, then by date.
create index if not exists articles_pinned_idx
  on public.articles (published, pinned desc, published_at desc);
