-- Create purchase items table
CREATE TABLE purchase_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    purchase_id UUID REFERENCES consumable_purchases(id) NOT NULL,
    consumable_id UUID REFERENCES consumables(id) NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_time DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for purchase_items
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