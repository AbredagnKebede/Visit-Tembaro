-- Drop existing indexes if they exist
DROP INDEX IF EXISTS cultural_items_category_idx;
DROP INDEX IF EXISTS cultural_items_created_at_idx;

-- Drop the existing table if it exists
DROP TABLE IF EXISTS cultural_items;

-- Recreate the cultural_items table with all required columns
CREATE TABLE cultural_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Recreate indexes
CREATE INDEX cultural_items_category_idx ON cultural_items(category);
CREATE INDEX cultural_items_created_at_idx ON cultural_items(created_at);

-- Recreate the trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cultural_items_updated_at
    BEFORE UPDATE ON cultural_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 