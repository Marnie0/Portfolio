-- ============================================================
--  STEP 6 — Telegram contact button
--  One column, mirroring whatsapp_url. Safe to re-run.
-- ============================================================

alter table public.site_settings
  add column if not exists telegram_url text not null default '';
