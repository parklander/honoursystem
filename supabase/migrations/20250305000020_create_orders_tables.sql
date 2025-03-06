-- Create enum for order status
CREATE TYPE order_status AS ENUM ('unpaid', 'paid');

-- Create orders table
CREATE TABLE consumable_purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status order_status DEFAULT 'unpaid' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create order items table
CREATE TABLE purchase_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    purchase_id UUID REFERENCES consumable_purchases(id) NOT NULL,
    consumable_id UUID REFERENCES consumables(id) NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_time DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add RLS policies
ALTER TABLE consumable_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view their own orders"
    ON consumable_purchases
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can create their own orders"
    ON consumable_purchases
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can view their own order items
CREATE POLICY "Users can view their own order items"
    ON purchase_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM consumable_purchases
            WHERE consumable_purchases.id = purchase_id
            AND consumable_purchases.user_id = auth.uid()
        )
    );

-- Users can create their own order items
CREATE POLICY "Users can create their own order items"
    ON purchase_items
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM consumable_purchases
            WHERE consumable_purchases.id = purchase_id
            AND consumable_purchases.user_id = auth.uid()
        )
    );

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
    ON consumable_purchases
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND 'admin' = ANY(user_profiles.roles)
        )
    );

-- Admins can view all order items
CREATE POLICY "Admins can view all order items"
    ON purchase_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND 'admin' = ANY(user_profiles.roles)
        )
    ); 