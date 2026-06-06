-- ============================================================
-- KlarKit Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Admins can view all profiles" on profiles
  for select using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- CATEGORIES
-- ============================================================
create table if not exists categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table categories enable row level security;

create policy "Anyone can view categories" on categories
  for select using (true);

create policy "Admins can manage categories" on categories
  for all using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================================
-- PRODUCTS
-- ============================================================
create table if not exists products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text not null default '',
  short_description text not null default '',
  price numeric(10,2) not null default 0,
  original_price numeric(10,2),
  category_id uuid references categories(id),
  type text not null default 'digital' check (type in ('digital', 'affiliate')),
  images text[] default '{}',
  file_url text,
  affiliate_url text,
  tags text[] default '{}',
  is_featured boolean default false,
  is_active boolean default true,
  stock int,
  download_count int default 0,
  meta_title text,
  meta_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table products enable row level security;

create policy "Anyone can view active products" on products
  for select using (is_active = true);

create policy "Admins can manage products" on products
  for all using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create index idx_products_slug on products(slug);
create index idx_products_category on products(category_id);
create index idx_products_featured on products(is_featured) where is_featured = true;
create index idx_products_active on products(is_active) where is_active = true;

-- Full text search
alter table products add column if not exists search_vector tsvector
  generated always as (
    to_tsvector('german', name || ' ' || coalesce(short_description, '') || ' ' || coalesce(description, ''))
  ) stored;

create index idx_products_search on products using gin(search_vector);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

-- ============================================================
-- REVIEWS
-- ============================================================
create table if not exists reviews (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  rating int not null check (rating between 1 and 5),
  title text,
  body text,
  is_verified boolean default false,
  created_at timestamptz default now(),
  unique(product_id, user_id)
);

alter table reviews enable row level security;

create policy "Anyone can view reviews" on reviews
  for select using (true);

create policy "Users can create reviews" on reviews
  for insert with check (auth.uid() = user_id);

create policy "Users can update own reviews" on reviews
  for update using (auth.uid() = user_id);

create policy "Admins can manage reviews" on reviews
  for all using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================================
-- COUPONS
-- ============================================================
create table if not exists coupons (
  id uuid default uuid_generate_v4() primary key,
  code text not null unique,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(10,2) not null,
  min_order_amount numeric(10,2),
  max_uses int,
  used_count int default 0,
  expires_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table coupons enable row level security;

create policy "Admins can manage coupons" on coupons
  for all using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================================
-- ORDERS
-- ============================================================
create table if not exists orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id),
  email text not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  total numeric(10,2) not null default 0,
  stripe_payment_intent_id text,
  stripe_session_id text,
  coupon_id uuid references coupons(id),
  discount_amount numeric(10,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table orders enable row level security;

create policy "Users can view own orders" on orders
  for select using (auth.uid() = user_id or email = auth.jwt()->>'email');

create policy "Admins can manage orders" on orders
  for all using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy "Service role can create orders" on orders
  for insert with check (true);

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table if not exists order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) not null,
  product_name text not null,
  price numeric(10,2) not null,
  quantity int not null default 1,
  download_url text,
  download_expires_at timestamptz,
  created_at timestamptz default now()
);

alter table order_items enable row level security;

create policy "Users can view own order items" on order_items
  for select using (
    exists (
      select 1 from orders
      where orders.id = order_id
      and (orders.user_id = auth.uid() or orders.email = auth.jwt()->>'email')
    )
  );

create policy "Admins can manage order items" on order_items
  for all using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy "Service role can create order items" on order_items
  for insert with check (true);

-- ============================================================
-- SEED DATA - Categories
-- ============================================================
insert into categories (name, slug, description, icon, sort_order) values
  ('Vorlagen', 'templates', 'Sofort einsetzbare digitale Vorlagen', 'FileText', 1),
  ('Guides & E-Books', 'guides', 'Schritt-für-Schritt Anleitungen und E-Books', 'BookOpen', 2),
  ('Mini-Kurse', 'courses', 'Kompakte Online-Kurse für schnelles Lernen', 'GraduationCap', 3),
  ('Tool-Empfehlungen', 'tools', 'Kuratierte Software-Empfehlungen', 'Wrench', 4)
on conflict (slug) do nothing;

-- ============================================================
-- SEED DATA - Example Products
-- ============================================================
insert into products (name, slug, description, short_description, price, original_price, category_id, type, images, tags, is_featured, is_active)
select
  'Content Planner Kit',
  'content-planner-kit',
  E'Das Content Planner Kit ist die ultimative Vorlage für Content Creator, Selbstständige und kleine Unternehmen.\n\n**Was ist enthalten:**\n- Monatsplaner für strukturierte Planung\n- Ideenliste für niemals leere Redaktionspläne\n- Posting-Kalender für Instagram, TikTok, LinkedIn und Blog\n- KPI-Tracking zur Erfolgsmessung\n- 5 vorgefertigte Vorlagen für verschiedene Plattformen\n\n**Für wen ist es geeignet:**\nIdeal für alle, die ihre Content-Strategie professionalisieren möchten, ohne Stunden in die Planung zu investieren.\n\n**Was du nach dem Kauf erhältst:**\nSofortiger Download als Google Sheets und Notion-Vorlage.',
  'Strukturiere deine Content-Strategie mit unserem umfassenden Planer für alle Plattformen.',
  19.00,
  29.00,
  c.id,
  'digital',
  array['https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800'],
  array['content', 'planer', 'social-media', 'notion', 'google-sheets'],
  true,
  true
from categories c where c.slug = 'templates';

insert into products (name, slug, description, short_description, price, original_price, category_id, type, images, tags, is_featured, is_active)
select
  'Freelancer Startpaket',
  'freelancer-startpaket',
  E'Das Freelancer Startpaket enthält alles, was du als neuer Freelancer brauchst, um professionell durchzustarten.\n\n**Was ist enthalten:**\n- Professionelle Angebotsvorlage\n- Rechnungsvorlage (DSGVO-konform)\n- Kundenbriefing-Vorlage\n- Projektplan-Template\n- Preisrechner (Excel)\n- Checkliste für den Start als Freelancer\n\n**Für wen ist es geeignet:**\nPerfekt für alle, die gerade als Freelancer starten und sofort professionell auftreten wollen.\n\n**Was du nach dem Kauf erhältst:**\nSofortiger Download als ZIP-Paket mit allen Dateien.',
  'Alles was du als Freelancer für den professionellen Start brauchst – in einem Paket.',
  29.00,
  49.00,
  c.id,
  'digital',
  array['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800'],
  array['freelancer', 'vorlage', 'rechnung', 'angebot', 'start'],
  true,
  true
from categories c where c.slug = 'templates';

insert into products (name, slug, description, short_description, price, original_price, category_id, type, images, tags, is_featured, is_active)
select
  'Online Business starten – Der Guide',
  'online-business-starten-guide',
  E'Dein kompletter Leitfaden für den Start eines erfolgreichen Online-Business.\n\n**Was ist enthalten:**\n- 80-seitiger Guide als PDF\n- Schritt-für-Schritt Anleitung\n- Checklisten für jeden Schritt\n- Tool-Empfehlungen mit Erklärungen\n- Beispiele und Fallstudien\n\n**Themen:**\n- Ideenfindung und Nischen-Analyse\n- Zielgruppe definieren\n- Produkt oder Dienstleistung entwickeln\n- Online-Präsenz aufbauen\n- Erste Kunden gewinnen\n- Skalieren und automatisieren\n\n**Was du nach dem Kauf erhältst:**\nSofortiger Download als PDF.',
  'Der vollständige Guide für deinen Start ins Online-Business – klar, strukturiert, umsetzbar.',
  17.00,
  null,
  c.id,
  'digital',
  array['https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800'],
  array['guide', 'online-business', 'start', 'e-book'],
  true,
  true
from categories c where c.slug = 'guides';

insert into products (name, slug, description, short_description, price, original_price, category_id, type, images, tags, is_featured, is_active)
select
  'KI-Tools sinnvoll nutzen',
  'ki-tools-guide',
  E'Lerne, wie du KI-Tools effektiv in deinen Arbeitsalltag integrierst.\n\n**Was ist enthalten:**\n- 60-seitiger Guide als PDF\n- Übersicht der besten KI-Tools 2024\n- Konkrete Anwendungsbeispiele\n- Prompting-Tipps und Tricks\n- Workflows für verschiedene Berufsfelder\n\n**Themen:**\n- ChatGPT, Claude, Gemini im Vergleich\n- KI für Content-Erstellung\n- KI für Produktivität und Organisation\n- KI für Design und Bilder\n- Automatisierungen mit KI\n\n**Was du nach dem Kauf erhältst:**\nSofortiger Download als PDF.',
  'So nutzt du KI-Tools produktiv und gewinnst wertvolle Zeit zurück.',
  14.00,
  null,
  c.id,
  'digital',
  array['https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800'],
  array['ki', 'guide', 'produktivität', 'chatgpt', 'automation'],
  false,
  true
from categories c where c.slug = 'guides';

insert into products (name, slug, description, short_description, price, original_price, category_id, type, images, tags, is_featured, is_active)
select
  'Produktiv mit Notion – Mini-Kurs',
  'produktiv-mit-notion-kurs',
  E'Lerne Notion von Grund auf und baue dein persönliches Produktivitätssystem.\n\n**Was ist enthalten:**\n- 8 Video-Lektionen (gesamt ca. 3 Stunden)\n- Übungsaufgaben zu jeder Lektion\n- Fertige Notion-Templates als Bonus\n- Lifetime-Zugang zum Kurs\n\n**Lernziele:**\n- Notion Grundlagen meistern\n- Datenbanken verstehen und nutzen\n- Personal Wiki aufbauen\n- Task-Management-System erstellen\n- Habit Tracker und Journal einrichten\n\n**Für wen ist es geeignet:**\nAnfänger und Einsteiger in Notion.',
  'Von 0 auf produktiv mit Notion – baue dein persönliches System in einem Wochenende.',
  39.00,
  59.00,
  c.id,
  'digital',
  array['https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800'],
  array['notion', 'kurs', 'produktivität', 'mini-kurs'],
  true,
  true
from categories c where c.slug = 'courses';
