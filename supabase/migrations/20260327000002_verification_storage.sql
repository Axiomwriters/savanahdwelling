
-- Storage bucket for verification documents (ID cards, selfies)
-- Run this after creating the verification_sessions migration

-- Create the bucket (public: false for security)
-- Note: Run this via Supabase Dashboard > Storage > New Bucket
-- Or use the Supabase CLI: supabase storage create bucket verification-docs --no-public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'verification-docs',
  'verification-docs',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage objects (not buckets)
-- Users can view their own verification documents
CREATE POLICY "users_view_own_verification_docs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'verification-docs'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can upload verification documents to their own folder
CREATE POLICY "users_upload_own_verification_docs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'verification-docs'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own verification documents
CREATE POLICY "users_delete_own_verification_docs"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'verification-docs'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
