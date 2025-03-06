-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can update consumable_purchases" ON consumable_purchases;

-- Add policy for updating consumable_purchases
CREATE POLICY "Admins can update consumable_purchases"
    ON consumable_purchases
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND 'admin' = ANY(user_profiles.roles)
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND 'admin' = ANY(user_profiles.roles)
        )
    );

-- Verify existing policies
SELECT * FROM pg_policies WHERE tablename = 'consumable_purchases'; 