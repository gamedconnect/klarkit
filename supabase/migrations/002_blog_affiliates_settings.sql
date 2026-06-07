-- Blog posts
create table if not exists blog_posts (
  id            uuid default gen_random_uuid() primary key,
  title         text not null,
  slug          text not null unique,
  excerpt       text,
  content       text,
  category      text,
  cover_image   text,
  published     boolean default false,
  author_id     uuid references auth.users(id) on delete set null,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table blog_posts enable row level security;

create policy "Öffentlich: veröffentlichte Beiträge lesen"
  on blog_posts for select using (published = true);

create policy "Admins: voller Zugriff auf Blog"
  on blog_posts using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- Affiliate links
create table if not exists affiliate_links (
  id             uuid default gen_random_uuid() primary key,
  name           text not null,
  description    text,
  url            text not null,
  category       text,
  pricing        text,
  use_case       text,
  is_recommended boolean default false,
  sort_order     int default 0,
  created_at     timestamptz default now()
);

alter table affiliate_links enable row level security;

create policy "Öffentlich: alle Links lesen"
  on affiliate_links for select using (true);

create policy "Admins: voller Zugriff auf Affiliate-Links"
  on affiliate_links using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- Site settings (key-value store)
create table if not exists site_settings (
  key        text primary key,
  value      text,
  updated_at timestamptz default now()
);

alter table site_settings enable row level security;

create policy "Öffentlich: alle Settings lesen"
  on site_settings for select using (true);

create policy "Admins: voller Zugriff auf Settings"
  on site_settings using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- Krypto-Felder in orders (falls noch nicht vorhanden)
alter table orders
  add column if not exists payment_method text default 'stripe',
  add column if not exists tx_hash        text,
  add column if not exists wallet_from    text,
  add column if not exists amount_eth     text;
