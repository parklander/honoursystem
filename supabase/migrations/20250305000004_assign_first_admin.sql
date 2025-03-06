-- Assign admin role to the first user in the system
UPDATE user_profiles
SET roles = array_append(roles, 'admin'::user_role)
WHERE id = (
    SELECT id 
    FROM auth.users 
    ORDER BY created_at 
    LIMIT 1
); 