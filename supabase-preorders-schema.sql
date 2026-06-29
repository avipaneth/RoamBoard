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

create table if not exists public.preorder_funnel_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  first_name text,
  last_name text,
  name text not null,
  email text not null,
  quantity integer not null default 1 check (quantity > 0),
  colour text,
  marketing_consent boolean not null default false,
  source text default 'checkout_modal',

  stage text not null check (stage in ('buy_details_submitted', 'preorder_committed')),
  buy_details_submitted boolean not null default false,
  preorder_committed boolean not null default false
);

alter table public.preorder_funnel_events enable row level security;

drop policy if exists "Allow public preorder funnel event inserts" on public.preorder_funnel_events;

create policy "Allow public preorder funnel event inserts"
on public.preorder_funnel_events
for insert
to anon
with check (
  name is not null
  and email is not null
  and quantity > 0
  and (
    (stage = 'buy_details_submitted' and buy_details_submitted = true and preorder_committed = false)
    or
    (stage = 'preorder_committed' and buy_details_submitted = false and preorder_committed = true)
  )
);

notify pgrst, 'reload schema';
