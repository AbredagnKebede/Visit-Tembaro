-- Enable RLS on cultural_items table
ALTER TABLE cultural_items ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read all cultural items
CREATE POLICY "Allow authenticated users to read cultural items"
ON cultural_items FOR SELECT
TO authenticated
USING (true);

-- Create policy for authenticated users to insert cultural items
CREATE POLICY "Allow authenticated users to insert cultural items"
ON cultural_items FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy for authenticated users to update cultural items
CREATE POLICY "Allow authenticated users to update cultural items"
ON cultural_items FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy for authenticated users to delete cultural items
CREATE POLICY "Allow authenticated users to delete cultural items"
ON cultural_items FOR DELETE
TO authenticated
USING (true);

-- Create policy for public to read cultural items
CREATE POLICY "Allow public to read cultural items"
ON cultural_items FOR SELECT
TO public
USING (true); 