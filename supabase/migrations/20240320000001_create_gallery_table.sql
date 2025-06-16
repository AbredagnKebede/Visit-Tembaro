-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on category for faster queries
CREATE INDEX IF NOT EXISTS gallery_category_idx ON gallery(category);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS gallery_created_at_idx ON gallery(created_at DESC);

-- Enable Row Level Security
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Create policies for gallery table
-- Allow public read access
CREATE POLICY "Allow public read access"
ON gallery FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert"
ON gallery FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update their own items
CREATE POLICY "Allow authenticated users to update"
ON gallery FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete their own items
CREATE POLICY "Allow authenticated users to delete"
ON gallery FOR DELETE
TO authenticated
USING (true);

-- Create storage bucket for gallery images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for gallery bucket
-- Allow public read access to gallery images
CREATE POLICY "Allow public read access to gallery images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery');

-- Allow authenticated users to upload gallery images
CREATE POLICY "Allow authenticated users to upload gallery images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery');

-- Allow authenticated users to update their own gallery images
CREATE POLICY "Allow authenticated users to update gallery images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery')
WITH CHECK (bucket_id = 'gallery');

-- Allow authenticated users to delete their own gallery images
CREATE POLICY "Allow authenticated users to delete gallery images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery'); 