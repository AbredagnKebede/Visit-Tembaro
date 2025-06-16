-- Add missing columns to gallery table
DO $$ 
BEGIN
    -- Add title column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'gallery' 
        AND column_name = 'title'
    ) THEN
        ALTER TABLE gallery ADD COLUMN title TEXT NOT NULL DEFAULT '';
    END IF;

    -- Add description column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'gallery' 
        AND column_name = 'description'
    ) THEN
        ALTER TABLE gallery ADD COLUMN description TEXT NOT NULL DEFAULT '';
    END IF;

    -- Add image_url column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'gallery' 
        AND column_name = 'image_url'
    ) THEN
        ALTER TABLE gallery ADD COLUMN image_url TEXT NOT NULL DEFAULT '';
    END IF;

    -- Add category column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'gallery' 
        AND column_name = 'category'
    ) THEN
        ALTER TABLE gallery ADD COLUMN category TEXT NOT NULL DEFAULT 'nature';
    END IF;

    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'gallery' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE gallery ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
    END IF;

    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'gallery' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE gallery ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS gallery_category_idx ON gallery(category);
CREATE INDEX IF NOT EXISTS gallery_created_at_idx ON gallery(created_at DESC); 