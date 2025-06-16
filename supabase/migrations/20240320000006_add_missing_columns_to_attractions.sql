-- Add missing columns to attractions table
DO $$ 
BEGIN
    -- Add name column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'attractions' 
        AND column_name = 'name'
    ) THEN
        ALTER TABLE attractions ADD COLUMN name TEXT NOT NULL DEFAULT '';
    END IF;

    -- Add description column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'attractions' 
        AND column_name = 'description'
    ) THEN
        ALTER TABLE attractions ADD COLUMN description TEXT NOT NULL DEFAULT '';
    END IF;

    -- Add short_description column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'attractions' 
        AND column_name = 'short_description'
    ) THEN
        ALTER TABLE attractions ADD COLUMN short_description TEXT NOT NULL DEFAULT '';
    END IF;

    -- Add image_url column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'attractions' 
        AND column_name = 'image_url'
    ) THEN
        ALTER TABLE attractions ADD COLUMN image_url TEXT NOT NULL DEFAULT '';
    END IF;

    -- Add location column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'attractions' 
        AND column_name = 'location'
    ) THEN
        ALTER TABLE attractions ADD COLUMN location JSONB NOT NULL DEFAULT '{"latitude": 0, "longitude": 0, "address": ""}';
    END IF;

    -- Add category column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'attractions' 
        AND column_name = 'category'
    ) THEN
        ALTER TABLE attractions ADD COLUMN category TEXT NOT NULL DEFAULT 'nature';
    END IF;

    -- Add featured column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'attractions' 
        AND column_name = 'featured'
    ) THEN
        ALTER TABLE attractions ADD COLUMN featured BOOLEAN NOT NULL DEFAULT false;
    END IF;

    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'attractions' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE attractions ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
    END IF;

    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'attractions' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE attractions ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS attractions_category_idx ON attractions(category);
CREATE INDEX IF NOT EXISTS attractions_featured_idx ON attractions(featured);
CREATE INDEX IF NOT EXISTS attractions_created_at_idx ON attractions(created_at DESC); 