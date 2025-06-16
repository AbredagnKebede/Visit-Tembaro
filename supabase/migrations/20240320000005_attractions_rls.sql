-- Enable Row Level Security
ALTER TABLE attractions ENABLE ROW LEVEL SECURITY;

-- Create policies for attractions table
-- Allow public read access
CREATE POLICY "Allow public read access"
ON attractions FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert"
ON attractions FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update"
ON attractions FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete"
ON attractions FOR DELETE
TO authenticated
USING (true);

-- Create storage bucket for attractions images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('attractions', 'attractions', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for attractions bucket
-- Allow public read access to attraction images
CREATE POLICY "Allow public read access to attraction images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'attractions');

-- Allow authenticated users to upload attraction images
CREATE POLICY "Allow authenticated users to upload attraction images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'attractions');

-- Allow authenticated users to update their own attraction images
CREATE POLICY "Allow authenticated users to update attraction images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'attractions')
WITH CHECK (bucket_id = 'attractions');

-- Allow authenticated users to delete their own attraction images
CREATE POLICY "Allow authenticated users to delete attraction images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'attractions'); 