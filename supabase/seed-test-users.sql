-- Seed script for Admin Auth validation
-- Creates 3 test users in Supabase Auth with roles:
-- ADMIN (full access), EDITOR (content), COMUNICACAO (news/media)

-- This script should be run after creating auth users via Supabase Admin API
-- or Supabase Dashboard. The auth.users records must exist first.

-- Example: Create auth users first (via Supabase Dashboard or Admin API):
-- 1. admin@test.carlosburigo.rs.gov.br / TestAdmin123!
-- 2. editor@test.carlosburigo.rs.gov.br / TestEditor123!
-- 3. comunicacao@test.carlosburigo.rs.gov.br / TestComunicacao123!

-- Then run this SQL to create profiles and assign roles:

-- ADMIN user
INSERT INTO public.profiles (id, name, cargo, avatar_url)
VALUES (
  '533f4f2f-cd60-4618-a28d-323c95145d3b',
  'Admin Test User',
  'Administrador do Sistema',
  null
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  cargo = EXCLUDED.cargo;

INSERT INTO public.user_roles (user_id, role)
VALUES ('533f4f2f-cd60-4618-a28d-323c95145d3b', 'ADMIN')
ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;

-- EDITOR user
INSERT INTO public.profiles (id, name, cargo, avatar_url)
VALUES (
  '98f89853-5ad3-41eb-b450-7417f9c805d7',
  'Editor Test User',
  'Editor de Conteúdo',
  null
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  cargo = EXCLUDED.cargo;

INSERT INTO public.user_roles (user_id, role)
VALUES ('98f89853-5ad3-41eb-b450-7417f9c805d7', 'EDITOR')
ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;

-- COMUNICACAO user
INSERT INTO public.profiles (id, name, cargo, avatar_url)
VALUES (
  'b0a8047c-99ae-40a2-8827-a278d4800d39',
  'Comunicação Test User',
  'Assessoria de Comunicação',
  null
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  cargo = EXCLUDED.cargo;

INSERT INTO public.user_roles (user_id, role)
VALUES ('b0a8047c-99ae-40a2-8827-a278d4800d39', 'COMUNICACAO')
ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;

-- Verify
SELECT 
  p.id,
  p.name,
  p.cargo,
  ur.role
FROM public.profiles p
JOIN public.user_roles ur ON ur.user_id = p.id
WHERE p.id IN (
  '533f4f2f-cd60-4618-a28d-323c95145d3b',
  '98f89853-5ad3-41eb-b450-7417f9c805d7',
  'b0a8047c-99ae-40a2-8827-a278d4800d39'
);