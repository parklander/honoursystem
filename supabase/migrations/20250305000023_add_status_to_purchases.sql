-- Create order_status type if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE order_status AS ENUM ('unpaid', 'paid');
    END IF;
END $$;

-- Add status column to consumable_purchases
ALTER TABLE consumable_purchases 
ADD COLUMN IF NOT EXISTS status order_status DEFAULT 'unpaid' NOT NULL; 