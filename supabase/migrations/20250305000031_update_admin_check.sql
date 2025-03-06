-- Drop existing policies
DROP POLICY IF EXISTS "Admins can update consumable_purchases" ON consumable_purchases;

-- Updated policy to check for admin role in any of user's profiles
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

-- Update the view policy as well
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