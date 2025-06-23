-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS gallery_category_idx ON gallery(category);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_gallery_updated_at
    BEFORE UPDATE ON gallery
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Public can view gallery items"
    ON gallery FOR SELECT
    USING (true);

-- Policy for admins to manage gallery items
CREATE POLICY "Admins can manage gallery items"
    ON gallery
    USING (auth.uid() IN (
        SELECT user_id FROM user_roles WHERE role = 'admin'
    )); 