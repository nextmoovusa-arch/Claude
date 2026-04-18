-- ============================================================
-- NextMoov USA — Public read access + athlete extra fields
-- ============================================================

-- Add extra athlete fields used by the public site
alter table athletes
  add column if not exists quote   text,
  add column if not exists motiv   text,
  add column if not exists message text;

-- ─── Public (anon) read policies ────────────────────────────
-- Allow the static Netlify site to fetch data without auth

create policy "public read athletes" on athletes
  for select to anon using (true);

create policy "public read testimonials" on testimonials
  for select to anon using (true);

create policy "public read showcase_events" on showcase_events
  for select to anon using (is_published = true);

create policy "public read social_posts" on social_posts
  for select to anon using (true);
