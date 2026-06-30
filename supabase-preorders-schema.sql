create extension if not exists pgcrypto;

create table if not exists public.preorders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  client_id text not null,
  action text not null check (action in ('buy_now_clicked', 'checkout_submitted', 'preorder_committed')),

  first_name text,
  last_name text,
  email text,
  quantity integer check (quantity is null or quantity > 0),
  colour text,
  marketing_consent boolean not null default false
);

alter table public.preorders
add column if not exists client_id text,
add column if not exists action text,
add column if not exists first_name text,
add column if not exists last_name text,
add column if not exists email text,
add column if not exists quantity integer,
add column if not exists colour text,
add column if not exists marketing_consent boolean not null default false;

alter table public.preorders
alter column email drop not null,
alter column quantity drop not null,
alter column quantity drop default,
alter column marketing_consent set default false;

update public.preorders
set
  client_id = coalesce(client_id, id::text),
  action = coalesce(action, 'preorder_committed'),
  marketing_consent = coalesce(marketing_consent, false);

alter table public.preorders
drop column if exists name,
drop column if exists source,
drop column if exists variant,
drop column if exists notes,
drop column if exists status,
drop column if exists buy_details_submitted,
drop column if exists preorder_committed,
drop column if exists stage;

drop index if exists preorders_email_unique;
drop index if exists preorders_committed_email_unique;

do $$
begin
  if to_regclass('public.preorder_funnel_events') is not null then
    insert into public.preorders (
      created_at,
      client_id,
      action,
      first_name,
      last_name,
      email,
      quantity,
      colour,
      marketing_consent
    )
    select
      funnel.created_at,
      'legacy_funnel_' || funnel.id::text,
      case
        when funnel.stage = 'preorder_committed' or funnel.preorder_committed is true then 'preorder_committed'
        else 'checkout_submitted'
      end,
      funnel.first_name,
      funnel.last_name,
      funnel.email,
      funnel.quantity,
      funnel.colour,
      funnel.marketing_consent
    from public.preorder_funnel_events as funnel
    where not exists (
      select 1
      from public.preorders
      where preorders.client_id = 'legacy_funnel_' || funnel.id::text
    );
  end if;
end $$;

alter table public.preorders
alter column client_id set not null,
alter column action set not null,
alter column marketing_consent set not null;

alter table public.preorders
drop constraint if exists preorders_action_check,
drop constraint if exists preorders_quantity_check;

alter table public.preorders
add constraint preorders_action_check
check (action in ('buy_now_clicked', 'checkout_submitted', 'preorder_committed'));

alter table public.preorders
add constraint preorders_quantity_check
check (quantity is null or quantity > 0);

drop policy if exists "Allow public preorder inserts" on public.preorders;

drop table if exists public.preorder_funnel_events;

create index if not exists preorders_action_created_at_idx
on public.preorders (action, created_at desc);

create index if not exists preorders_email_action_idx
on public.preorders (lower(email), action)
where email is not null;

alter table public.preorders enable row level security;

create policy "Allow public preorder inserts"
on public.preorders
for insert
to anon
with check (
  coalesce(client_id, '') <> ''
  and action in ('buy_now_clicked', 'checkout_submitted', 'preorder_committed')
  and (
    action = 'buy_now_clicked'
    or (
      coalesce(first_name, '') <> ''
      and coalesce(last_name, '') <> ''
      and email is not null
      and quantity > 0
      and colour is not null
    )
  )
);

notify pgrst, 'reload schema';
