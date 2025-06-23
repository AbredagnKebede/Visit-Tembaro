-- Create attractions table
CREATE TABLE IF NOT EXISTS attractions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    image_url TEXT,
    location JSONB NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    duration TEXT NOT NULL,
    accessibility TEXT NOT NULL,
    highlights TEXT[] NOT NULL,
    best_time TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS attractions_category_idx ON attractions(category);
CREATE INDEX IF NOT EXISTS attractions_featured_idx ON attractions(featured);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_attractions_updated_at
    BEFORE UPDATE ON attractions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE attractions ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Public can view attractions"
    ON attractions FOR SELECT
    USING (true);

-- Policy for admins to manage attractions
CREATE POLICY "Admins can manage attractions"
    ON attractions
    USING (auth.uid() IN (
        SELECT user_id FROM user_roles WHERE role = 'admin'
    )); 