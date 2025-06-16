-- Enable RLS on news table
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read all news articles
CREATE POLICY "Allow authenticated users to read news articles"
ON news FOR SELECT
TO authenticated
USING (true);

-- Create policy for authenticated users to insert news articles
CREATE POLICY "Allow authenticated users to insert news articles"
ON news FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy for authenticated users to update news articles
CREATE POLICY "Allow authenticated users to update news articles"
ON news FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy for authenticated users to delete news articles
CREATE POLICY "Allow authenticated users to delete news articles"
ON news FOR DELETE
TO authenticated
USING (true);

-- Create policy for public to read news articles
CREATE POLICY "Allow public to read news articles"
ON news FOR SELECT
TO public
USING (true); 