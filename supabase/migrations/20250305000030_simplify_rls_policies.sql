-- Drop existing policies
DROP POLICY IF EXISTS "Admins can update consumable_purchases" ON consumable_purchases;

-- Simpler update policy for admins
CREATE POLICY "Admins can update consumable_purchases"
    ON consumable_purchases
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND 'admin' = ANY(user_profiles.roles)
        )
    );

-- Let's also verify the table has RLS enabled
ALTER TABLE consumable_purchases ENABLE ROW LEVEL SECURITY;

-- For debugging, let's add a function to check if a user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND 'admin' = ANY(user_profiles.roles)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Let's also ensure admins can select all records
DROP POLICY IF EXISTS "Admins can view all purchases" ON consumable_purchases;
CREATE POLICY "Admins can view all purchases"
    ON consumable_purchases
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND 'admin' = ANY(user_profiles.roles)
        )
    ); 