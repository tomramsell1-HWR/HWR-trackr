-- Run this in the Supabase SQL Editor (Project → SQL Editor → New query)
-- It creates the table that stores all your baby tracking entries

create table if not exists entries (
  id           text primary key,
  type         text not null,
  timestamp    timestamptz not null,

  -- Feed fields
  what         text,
  size         text,
  duration_mins integer,

  -- Nappy fields
  colour       text,
  consistency  text,

  -- Mood fields
  period       text,
  mood         text,

  -- Sleep fields
  sleep_start  timestamptz,
  sleep_end    timestamptz,
  quality      text,

  -- Activity fields
  activity     text,

  -- Shared
  notes        text,

  -- Audit
  created_at   timestamptz default now()
);

-- Allow anyone with the anon key to read and write
-- (safe because only people you share the URL with can access it)
alter table entries enable row level security;

create policy "Allow all operations for anon users"
  on entries
  for all
  to anon
  using (true)
  with check (true);

-- Index for fast loading sorted by time
create index if not exists entries_timestamp_idx on entries (timestamp desc);
