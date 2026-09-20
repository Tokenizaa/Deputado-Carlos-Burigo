-- Open Graph metadata for global sharing and CMS landing pages.
alter table public.site_settings
  add column if not exists seo_default_image_url text;

alter table public.pages
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists og_image_url text;

alter table public.page_versions
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists og_image_url text;

insert into storage.buckets (id, name, public)
values ('og-images', 'og-images', true)
on conflict (id) do update set public = true;

create policy "Public read OG images"
on storage.objects
for select
to public
using (bucket_id = 'og-images');

create policy "Service role upload OG images"
on storage.objects
for insert
to service_role
with check (bucket_id = 'og-images');

create policy "Service role update OG images"
on storage.objects
for update
to service_role
using (bucket_id = 'og-images')
with check (bucket_id = 'og-images');
