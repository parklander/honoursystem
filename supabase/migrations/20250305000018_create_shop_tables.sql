-- Create consumables table
CREATE TABLE consumables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL, -- e.g., 'piece', 'meter', 'gram'
    category TEXT NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    reorder_point INTEGER NOT NULL DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create consumable categories enum
CREATE TYPE consumable_category AS ENUM (
    'filament',
    'resin',
    'vinyl',
    'blanks',
    'wood',
    'metal',
    'plastic',
    'electronics',
    'fasteners',
    'adhesives',
    'finishing',
    'other'
);

-- Create purchase history table
CREATE TABLE consumable_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    consumable_id UUID REFERENCES consumables(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    notes TEXT
);

-- Create inventory adjustments table
CREATE TABLE inventory_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consumable_id UUID REFERENCES consumables(id) ON DELETE CASCADE,
    quantity_change INTEGER NOT NULL,
    adjustment_type TEXT NOT NULL, -- 'purchase', 'sale', 'damage', 'donation'
    adjusted_by UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    adjustment_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    notes TEXT
);

-- Add RLS policies
ALTER TABLE consumables ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumable_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_adjustments ENABLE ROW LEVEL SECURITY;

-- Policies for consumables
CREATE POLICY "Anyone can view consumables"
    ON consumables FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins can modify consumables"
    ON consumables FOR ALL
    USING ('admin' = ANY(ARRAY(
        SELECT roles FROM user_profiles WHERE id = auth.uid()
    )));

-- Policies for purchases
CREATE POLICY "Users can view their own purchases"
    ON consumable_purchases FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own purchases"
    ON consumable_purchases FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all purchases"
    ON consumable_purchases FOR SELECT
    TO authenticated
    USING ('admin' = ANY(ARRAY(
        SELECT roles FROM user_profiles WHERE id = auth.uid()
    )));

-- Policies for inventory adjustments
CREATE POLICY "Anyone can view inventory adjustments"
    ON inventory_adjustments FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins can modify inventory"
    ON inventory_adjustments FOR ALL
    USING ('admin' = ANY(ARRAY(
        SELECT roles FROM user_profiles WHERE id = auth.uid()
    )));

-- Function to update stock quantity
CREATE OR REPLACE FUNCTION update_stock_quantity()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.adjustment_type = 'purchase' THEN
        UPDATE consumables
        SET stock_quantity = stock_quantity + NEW.quantity_change
        WHERE id = NEW.consumable_id;
    ELSIF NEW.adjustment_type = 'sale' THEN
        UPDATE consumables
        SET stock_quantity = stock_quantity - NEW.quantity_change
        WHERE id = NEW.consumable_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for inventory adjustments
CREATE TRIGGER update_stock_on_adjustment
    AFTER INSERT ON inventory_adjustments
    FOR EACH ROW
    EXECUTE FUNCTION update_stock_quantity(); 