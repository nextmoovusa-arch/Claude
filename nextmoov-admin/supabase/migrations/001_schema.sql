-- ============================================================
-- NextMoov USA — Admin CMS Schema
-- Run this in your Supabase SQL editor or via Supabase CLI
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ─── Athletes ────────────────────────────────────────────────
create table if not exists athletes (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  sport         text not null,
  position      text,
  school_origin text,
  university_us text,
  state_us      text,
  season        text,
  bio           text,
  photo_url     text,
  is_featured   boolean not null default false,
  instagram_url text
);

-- ─── Testimonials ────────────────────────────────────────────
create table if not exists testimonials (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  athlete_name  text not null,
  sport         text not null,
  quote         text not null,
  rating        smallint not null default 5 check (rating between 1 and 5),
  photo_url     text,
  university_us text,
  season        text,
  is_featured   boolean not null default false
);

-- ─── Showcase Events ─────────────────────────────────────────
create table if not exists showcase_events (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  title             text not null,
  location          text not null,
  event_date        date not null,
  description       text,
  sports            text[] not null default '{}',
  capacity          integer,
  registration_url  text,
  photo_url         text,
  is_published      boolean not null default false
);

-- ─── Social Posts ────────────────────────────────────────────
create table if not exists social_posts (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  platform       text not null check (platform in ('instagram', 'tiktok', 'youtube', 'twitter')),
  post_url       text not null,
  caption        text,
  thumbnail_url  text,
  is_featured    boolean not null default false,
  published_at   timestamptz
);

-- ─── Row Level Security ──────────────────────────────────────
-- Enable RLS on all tables
alter table athletes       enable row level security;
alter table testimonials   enable row level security;
alter table showcase_events enable row level security;
alter table social_posts   enable row level security;

-- Only authenticated users (admins) can read/write
create policy "admins only" on athletes
  for all to authenticated using (true) with check (true);

create policy "admins only" on testimonials
  for all to authenticated using (true) with check (true);

create policy "admins only" on showcase_events
  for all to authenticated using (true) with check (true);

create policy "admins only" on social_posts
  for all to authenticated using (true) with check (true);
