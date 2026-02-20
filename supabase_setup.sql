-- Create a table for public profiles (extends auth.users)
create table profiles (
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

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a storage bucket for CNH images
insert into storage.buckets (id, name, public) 
values ('cnh-images', 'cnh-images', true);

-- Policy to allow public access to images
create policy "Images are publicly accessible." on storage.objects
  for select using (bucket_id = 'cnh-images');

create policy "Authenticated users can upload images." on storage.objects
  for insert with check (bucket_id = 'cnh-images' and auth.role() = 'authenticated');

-- Admin Policies (Full access for roles with 'admin')
-- Note: Simplified using a direct check to avoid recursion issues
create policy "Admins have full access to all profiles." on profiles
  for all using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Storage Admin Policies
create policy "Admins have full access to images." on storage.objects
  for all using (
    bucket_id = 'cnh-images' and 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- HELPER: Script to promote a user to admin (Run this in SQL Editor if needed)
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@chl.com';
