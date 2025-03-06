-- Drop existing policies
DROP POLICY IF EXISTS "Admins can update consumable_purchases" ON consumable_purchases;
DROP POLICY IF EXISTS "Admins can view all purchases" ON consumable_purchases;

-- Create new policy with explicit conditions
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
        AND status = 'unpaid'  -- Only allow updating unpaid orders
    );

-- Add policy for viewing purchases (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'consumable_purchases' 
        AND policyname = 'Admins can view all purchases'
    ) THEN
        EXECUTE 'CREATE POLICY "Admins can view all purchases"
            ON consumable_purchases
            FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM user_profiles
                    WHERE user_profiles.id = auth.uid()
                    AND ''admin'' = ANY(user_profiles.roles)
                )
            )';
    END IF;
END
$$; 