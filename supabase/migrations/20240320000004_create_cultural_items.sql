-- Create cultural items table
CREATE TABLE IF NOT EXISTS cultural_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    category TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS cultural_items_category_idx ON cultural_items(category);
CREATE INDEX IF NOT EXISTS cultural_items_featured_idx ON cultural_items(is_featured);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_cultural_items_updated_at
    BEFORE UPDATE ON cultural_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE cultural_items ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Public can view cultural items"
    ON cultural_items FOR SELECT
    USING (true);

-- Policy for admins to manage cultural items
CREATE POLICY "Admins can manage cultural items"
    ON cultural_items
    USING (auth.uid() IN (
        SELECT user_id FROM user_roles WHERE role = 'admin'
    )); 