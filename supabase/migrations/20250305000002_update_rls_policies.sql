-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;

-- Create a simpler, more permissive policy for testing
CREATE POLICY "Enable read access for all users"
    ON user_profiles FOR SELECT
    USING (true);

CREATE POLICY "Enable update for users based on id"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id); 