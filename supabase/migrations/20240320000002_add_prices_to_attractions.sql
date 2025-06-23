-- First add the price column
ALTER TABLE attractions
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);

-- Set default prices for existing attractions
UPDATE attractions
SET price = 50.00
WHERE price IS NULL OR price <= 0;

-- Make sure price is not null
ALTER TABLE attractions
ALTER COLUMN price SET NOT NULL; 