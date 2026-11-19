-- Rat Sniper counters (Cloudflare D1 database "rat_sniper").
-- One row per counter: all-time totals use the bare name ("rats"), daily totals add the UTC date ("rats:2026-11-18").
CREATE TABLE IF NOT EXISTS counters (
  name  TEXT PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0
);
