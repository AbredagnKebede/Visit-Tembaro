-- Enable Row Level Security
ALTER TABLE cultural_items ENABLE ROW LEVEL SECURITY;

-- Create policies for cultural_items table
CREATE POLICY "Allow public to read cultural items"
ON cultural_items FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to read cultural items"
ON cultural_items FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert cultural items"
ON cultural_items FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update cultural items"
ON cultural_items FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete cultural items"
ON cultural_items FOR DELETE
TO authenticated
USING (true);

-- Create storage policies for cultural bucket
CREATE POLICY "Allow public to read cultural images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'cultural');

CREATE POLICY "Allow authenticated users to upload cultural images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cultural');

CREATE POLICY "Allow authenticated users to update cultural images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'cultural')
WITH CHECK (bucket_id = 'cultural');

CREATE POLICY "Allow authenticated users to delete cultural images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'cultural'); 