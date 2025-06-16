-- Add category column to gallery table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'gallery' 
        AND column_name = 'category'
    ) THEN
        ALTER TABLE gallery ADD COLUMN category TEXT NOT NULL DEFAULT 'nature';
    END IF;
END $$;

-- Create index on category for faster queries if it doesn't exist
CREATE INDEX IF NOT EXISTS gallery_category_idx ON gallery(category); 