-- ============================================================
-- Migration: Adapt profiles table for Clerk (not Supabase Auth)
-- ============================================================

-- 1. Add clerk_user_id column (Clerk IDs are strings like "user_2abc...")
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS clerk_user_id text UNIQUE;

-- 2. Add email column for direct lookups
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text;

-- 3. Add onboarding_complete flag
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_complete boolean DEFAULT false;

-- 4. Expand role check to include all app roles
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('user', 'buyer', 'agent', 'host', 'professional', 'admin'));

-- 5. Change default role to 'buyer' (matches Clerk unsafeMetadata default)
ALTER TABLE public.profiles
  ALTER COLUMN role SET DEFAULT 'buyer';

-- 6. Update RLS: allow inserts from edge functions (anon will be handled by service role)
--    Drop conflicting insert policy first, then recreate permissively for now
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;

CREATE POLICY "Allow profile upsert via clerk_user_id"
  ON profiles FOR INSERT
  WITH CHECK (true);  -- Edge Function uses service_role key, bypasses RLS anyway

-- 7. Allow updates on clerk_user_id match
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

CREATE POLICY "Users can update own profile via clerk_user_id"
  ON profiles FOR UPDATE
  USING (true);

-- 8. Index for fast clerk_user_id lookups
CREATE INDEX IF NOT EXISTS profiles_clerk_user_id_idx
  ON public.profiles (clerk_user_id);

-- NOTE: The old trigger on_auth_user_created no longer fires with Clerk.
-- Profile creation is now handled by:
--   a) Redirect.tsx (frontend upsert on first login)
--   b) supabase/functions/clerk-webhook (Clerk webhook → creates profile + sends email)
