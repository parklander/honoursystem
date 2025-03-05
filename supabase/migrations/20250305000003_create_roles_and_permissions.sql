-- Create an enum for role types
CREATE TYPE user_role AS ENUM (
    'member',
    'trainer',
    'leader',
    'admin',
    'committee_member'
);

-- Create roles table with descriptions and hierarchy
CREATE TABLE roles (
    role user_role PRIMARY KEY,
    description TEXT NOT NULL,
    hierarchy_level INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert role definitions
INSERT INTO roles (role, description, hierarchy_level) VALUES
    ('member', 'Basic member with access to certified equipment', 10),
    ('trainer', 'Can certify other members on equipment', 20),
    ('leader', 'Manages space, maintenance, and inventory', 30),
    ('admin', 'Manages memberships and payments', 40),
    ('committee_member', 'Participates in makerspace governance', 50);

-- Modify user_profiles table to use the new role type
ALTER TABLE user_profiles 
    DROP COLUMN IF EXISTS access_level,
    ADD COLUMN roles user_role[] DEFAULT ARRAY['member']::user_role[];

-- Add space management for leaders
CREATE TABLE spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create space_leaders junction table
CREATE TABLE space_leaders (
    space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (space_id, user_id)
);

-- Update RLS policies for roles
CREATE POLICY "Enable read access for roles" ON roles
    FOR SELECT USING (true);

-- Function to check if a user has a specific role
CREATE OR REPLACE FUNCTION has_role(user_id UUID, required_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = user_id
        AND required_role = ANY(roles)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a user has any role with minimum hierarchy level
CREATE OR REPLACE FUNCTION has_minimum_role_level(user_id UUID, min_level INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles up
        JOIN LATERAL unnest(up.roles) role_item ON true
        JOIN roles r ON r.role = role_item
        WHERE up.id = user_id
        AND r.hierarchy_level >= min_level
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example policies using the role functions (commented out as we're keeping the permissive policies for now)
/*
CREATE POLICY "Leaders can view all profiles in their space"
    ON user_profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM space_leaders sl
            WHERE sl.user_id = auth.uid()
            AND has_role(auth.uid(), 'leader'::user_role)
        )
    );

CREATE POLICY "Admins can update roles"
    ON user_profiles FOR UPDATE
    USING (has_role(auth.uid(), 'admin'::user_role));
*/

-- Add trigger to update updated_at columns
CREATE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spaces_updated_at
    BEFORE UPDATE ON spaces
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 