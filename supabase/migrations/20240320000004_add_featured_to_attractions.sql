-- Add featured column to attractions table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'attractions' 
        AND column_name = 'featured'
    ) THEN
        ALTER TABLE attractions ADD COLUMN featured BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;

-- Create index on featured for faster queries
CREATE INDEX IF NOT EXISTS attractions_featured_idx ON attractions(featured); 