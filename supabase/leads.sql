-- Run once in Supabase → SQL Editor → New query → Run.
-- Creates the table that stores website leads (quote + contact forms).

create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type       text not null check (type in ('quote', 'contact')),
  name       text not null,
  email      text not null,
  phone      text,
  company    text,
  details    jsonb not null default '{}'::jsonb,
  status     text not null default 'new' check (status in ('new', 'contacted', 'won', 'lost'))
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- Lock the table: RLS on with NO public policies, so the public anon key can't
-- read or write it. Only the website's server function (service_role key) can insert.
alter table public.leads enable row level security;
revoke all on public.leads from anon, authenticated;
