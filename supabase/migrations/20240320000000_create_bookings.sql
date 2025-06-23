-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    attraction_id bigint REFERENCES attractions(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    number_of_people INTEGER NOT NULL CHECK (number_of_people > 0),
    total_price DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_attraction_id_idx ON bookings(attraction_id);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own bookings
CREATE POLICY "Users can view their own bookings"
    ON bookings FOR SELECT
    USING (auth.uid() = user_id);

-- Policy for users to create their own bookings
CREATE POLICY "Users can create their own bookings"
    ON bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own bookings
CREATE POLICY "Users can update their own bookings"
    ON bookings FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own bookings
CREATE POLICY "Users can delete their own bookings"
    ON bookings FOR DELETE
    USING (auth.uid() = user_id);

-- Policy for admins to manage all bookings
CREATE POLICY "Admins can manage all bookings"
    ON bookings
    USING (auth.uid() IN (
        SELECT user_id FROM user_roles WHERE role = 'admin'
    )); 