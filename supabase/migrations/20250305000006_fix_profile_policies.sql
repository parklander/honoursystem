-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;

-- Create a clear policy for reading profiles
CREATE POLICY "Enable reading own profile"
    ON user_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Create policy for admins to read all profiles
CREATE POLICY "Admins can read all profiles"
    ON user_profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 
            FROM user_profiles 
            WHERE id = auth.uid() 
            AND 'admin' = ANY(roles)
        )
    ); 