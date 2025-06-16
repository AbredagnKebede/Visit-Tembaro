-- Add is_featured column to cultural_items table
ALTER TABLE cultural_items
ADD COLUMN is_featured BOOLEAN DEFAULT false;

-- Create index for faster featured items queries
CREATE INDEX idx_cultural_items_is_featured ON cultural_items(is_featured);

-- Enable RLS
ALTER TABLE cultural_items ENABLE ROW LEVEL SECURITY;

-- Create base policy for all users to read cultural items
CREATE POLICY "Enable read access for all users"
ON cultural_items
FOR SELECT
USING (true);

-- Add policy for featured items
CREATE POLICY "Enable read access for featured items"
ON cultural_items
FOR SELECT
USING (is_featured = true); 