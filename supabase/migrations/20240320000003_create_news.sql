-- Create news table
CREATE TABLE IF NOT EXISTS news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    image_url TEXT,
    category TEXT NOT NULL,
    author TEXT NOT NULL,
    publish_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS news_category_idx ON news(category);
CREATE INDEX IF NOT EXISTS news_featured_idx ON news(featured);
CREATE INDEX IF NOT EXISTS news_publish_date_idx ON news(publish_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON news
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Public can view news"
    ON news FOR SELECT
    USING (true);

-- Policy for admins to manage news
CREATE POLICY "Admins can manage news"
    ON news
    USING (auth.uid() IN (
        SELECT user_id FROM user_roles WHERE role = 'admin'
    )); 