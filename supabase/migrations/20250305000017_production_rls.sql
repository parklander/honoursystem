-- Drop existing policies
DROP POLICY IF EXISTS "universal_read" ON user_profiles;
DROP POLICY IF EXISTS "self_update" ON user_profiles;
DROP POLICY IF EXISTS "admin_update" ON user_profiles;
DROP POLICY IF EXISTS "anyone_can_read_roles" ON roles;

-- User Profiles Policies

-- 1. Users can read their own profile
CREATE POLICY "read_own_profile"
    ON user_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- 2. Admins can read all profiles
CREATE POLICY "admin_read_all_profiles"
    ON user_profiles
    FOR SELECT
    USING ('admin' = ANY(ARRAY(
        SELECT roles FROM user_profiles WHERE id = auth.uid()
    )));

-- 3. Users can update their own basic info
CREATE POLICY "update_own_basic_info"
    ON user_profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        AND (OLD.roles IS NOT DISTINCT FROM NEW.roles)  -- Can't modify their own roles
        AND (OLD.membership_status IS NOT DISTINCT FROM NEW.membership_status)  -- Can't modify their own status
    );

-- 4. Admins can update any profile including roles
CREATE POLICY "admin_update_all_profiles"
    ON user_profiles
    FOR UPDATE
    USING ('admin' = ANY(ARRAY(
        SELECT roles FROM user_profiles WHERE id = auth.uid()
    )));

-- Roles Table Policies

-- 1. Anyone can read role definitions
CREATE POLICY "read_roles"
    ON roles
    FOR SELECT
    TO authenticated
    USING (true);

-- 2. Only admins can modify roles
CREATE POLICY "admin_modify_roles"
    ON roles
    FOR ALL
    USING ('admin' = ANY(ARRAY(
        SELECT roles FROM user_profiles WHERE id = auth.uid()
    ))); 