-- Create news storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('news', 'news', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to news images
CREATE POLICY "Allow public access to news images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'news');

-- Allow authenticated users to upload news images
CREATE POLICY "Allow authenticated users to upload news images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'news');

-- Allow authenticated users to update news images
CREATE POLICY "Allow authenticated users to update news images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'news')
WITH CHECK (bucket_id = 'news');

-- Allow authenticated users to delete news images
CREATE POLICY "Allow authenticated users to delete news images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'news'); 