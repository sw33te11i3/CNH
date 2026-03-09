-- RADICAL BYPASS - DISABLE RLS COMPLETELY FOR DEBUG
-- 1. Ensure table exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'user',
  name TEXT,
  cpf TEXT,
  sex TEXT,
  birth_date TEXT,
  father_name TEXT,
  mother_name TEXT,
  category TEXT,
  register_number TEXT,
  validity_date TEXT,
  first_license_date TEXT,
  issue_date TEXT,
  issue_place TEXT,
  issuing_body TEXT,
  observation TEXT,
  scores INTEGER DEFAULT 0,
  profile_image_url TEXT,
  cnh_front_image_url TEXT,
  cnh_back_image_url TEXT,
  qr_code_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. DISABLE RLS (This is the ultimate open door)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 3. Open Storage as well
-- Note: storage.objects RLS is harder to disable but we can use 'true' policies
DROP POLICY IF EXISTS "STORAGE_OPEN_SELECT" ON storage.objects;
DROP POLICY IF EXISTS "STORAGE_OPEN_INSERT" ON storage.objects;
DROP POLICY IF EXISTS "STORAGE_OPEN_UPDATE" ON storage.objects;
DROP POLICY IF EXISTS "STORAGE_OPEN_DELETE" ON storage.objects;

CREATE POLICY "STORAGE_FULL_OPEN" ON storage.objects FOR ALL USING (bucket_id = 'cnh-images') WITH CHECK (bucket_id = 'cnh-images');

-- 4. Clean up any stuck locks in DB if they exist (rare, but good to ensure)
-- No direct lock cleanup for PostgREST/PostgreSQL from here, but this opens everything.

-- 6. Garantir que o admin@chl.com seja Admin
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@chl.com';
