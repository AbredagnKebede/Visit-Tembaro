-- Drop existing indexes if they exist
DROP INDEX IF EXISTS news_category_idx;
DROP INDEX IF EXISTS news_featured_idx;
DROP INDEX IF EXISTS news_publish_date_idx;
DROP INDEX IF EXISTS news_created_at_idx;

-- Drop the existing table if it exists
DROP TABLE IF EXISTS news;

-- Recreate the news table with all required columns
CREATE TABLE news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    image_url TEXT,
    category TEXT NOT NULL,
    author TEXT NOT NULL,
    publish_date DATE NOT NULL,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Recreate indexes
CREATE INDEX news_category_idx ON news(category);
CREATE INDEX news_featured_idx ON news(featured);
CREATE INDEX news_publish_date_idx ON news(publish_date);
CREATE INDEX news_created_at_idx ON news(created_at);

-- Recreate the trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON news
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 