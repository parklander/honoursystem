-- Create a secure view for admin user management
CREATE OR REPLACE FUNCTION get_users_with_emails()
RETURNS TABLE (
    id UUID,
    full_name TEXT,
    email TEXT,
    roles user_role[],
    membership_status TEXT
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.id,
        up.full_name,
        au.email,
        up.roles,
        up.membership_status
    FROM user_profiles up
    LEFT JOIN auth.users au ON au.id = up.id
    WHERE EXISTS (
        SELECT 1 
        FROM user_profiles 
        WHERE id = auth.uid() 
        AND 'admin' = ANY(roles)
    );
END;
$$;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION get_users_with_emails() TO authenticated;

-- Create a policy to allow admins to execute the function
CREATE POLICY "Allow admins to view user emails"
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