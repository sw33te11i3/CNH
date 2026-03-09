-- 1. Create profiles table (if not exists)
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

-- 2. Simplified is_admin (Security Definer avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Recreate Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Admins have full access." ON public.profiles;

-- Permite leitura para todos (essencial para a CNH funcionar)
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

-- Permite insert apenas se for o próprio usuário (UID bate)
CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Permite update se for o próprio usuário OU se o UID logado for admin
CREATE POLICY "Users and Admins can update profiles." ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR is_admin());

-- Permite delete apenas se for admin
CREATE POLICY "Admins can delete profiles." ON public.profiles
  FOR DELETE USING (is_admin());

-- 5. Storage Policies
DROP POLICY IF EXISTS "Images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images." ON storage.objects;
DROP POLICY IF EXISTS "Admins have full access to images." ON storage.objects;

CREATE POLICY "Images are publicly accessible." ON storage.objects
  FOR SELECT USING (bucket_id = 'cnh-images');

CREATE POLICY "Users can upload to cnh-images." ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cnh-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to cnh-images." ON storage.objects
  FOR ALL USING (bucket_id = 'cnh-images' AND is_admin());

-- 6. Garantir que o admin@chl.com seja Admin
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@chl.com';
