create extension if not exists pgcrypto;

create table if not exists public.preorders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  first_name text,
  last_name text,
  name text not null,
  email text not null,
  quantity integer not null default 1 check (quantity > 0),
  colour text,
  variant text,
  notes text,

  marketing_consent boolean not null default false,
  source text default 'website',
  status text not null default 'registered_interest'
);

alter table public.preorders
add column if not exists first_name text,
add column if not exists last_name text;

create unique index if not exists preorders_email_unique
on public.preorders (lower(email));

alter table public.preorders enable row level security;

drop policy if exists "Allow public preorder inserts" on public.preorders;

create policy "Allow public preorder inserts"
on public.preorders
for insert
to anon
with check (
  name is not null
  and coalesce(first_name, '') <> ''
  and coalesce(last_name, '') <> ''
  and email is not null
  and quantity > 0
);
