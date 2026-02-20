-- 1. Create a table for public profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text default 'user',
  name text,
  cpf text,
  sex text,
  birth_date text,
  father_name text,
  mother_name text,
  category text,
  register_number text,
  validity_date text,
  first_license_date text,
  issue_date text,
  issue_place text,
  issuing_body text,
  observation text,
  scores integer default 0,
  profile_image_url text,
  cnh_front_image_url text,
  cnh_back_image_url text,
  qr_code_image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- 3. Clean up existing policies before recreating (Safe to run multiple times)
drop policy if exists "Public profiles are viewable by everyone." on profiles;
drop policy if exists "Users can insert their own profile." on profiles;
drop policy if exists "Users can update own profile." on profiles;
drop policy if exists "Admins have full access to all profiles." on profiles;
drop policy if exists "Admins can view all profiles." on profiles;
drop policy if exists "Admins can update all profiles." on profiles;
drop policy if exists "Admins can delete profiles." on profiles;

-- 4. Create policies
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

create policy "Admins have full access to all profiles." on profiles
  for all using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- 5. Set up Storage (Bucket)
insert into storage.buckets (id, name, public) 
values ('cnh-images', 'cnh-images', true)
on conflict (id) do nothing;

-- 6. Storage Policies
drop policy if exists "Images are publicly accessible." on storage.objects;
drop policy if exists "Authenticated users can upload images." on storage.objects;
drop policy if exists "Admins have full access to images." on storage.objects;

create policy "Images are publicly accessible." on storage.objects
  for select using (bucket_id = 'cnh-images');

create policy "Authenticated users can upload images." on storage.objects
  for insert with check (bucket_id = 'cnh-images' and auth.role() = 'authenticated');

create policy "Admins have full access to images." on storage.objects
  for all using (
    bucket_id = 'cnh-images' and 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- 7. HELPER: Script to promote a user to admin (Run this separately if needed)
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@chl.com';
