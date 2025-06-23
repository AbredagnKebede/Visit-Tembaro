-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS contact_messages_read_idx ON contact_messages(read);
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON contact_messages(created_at);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can create contact messages"
    ON contact_messages FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Admins can view all contact messages"
    ON contact_messages FOR SELECT
    TO authenticated
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update contact messages"
    ON contact_messages FOR UPDATE
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete contact messages"
    ON contact_messages FOR DELETE
    TO authenticated
    USING (auth.role() = 'authenticated'); 