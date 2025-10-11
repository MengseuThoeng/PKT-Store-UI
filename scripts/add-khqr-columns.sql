-- Add missing columns to payment_transactions table for KHQR integration
-- Run this in Supabase SQL Editor

ALTER TABLE payment_transactions
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- Add comments
COMMENT ON COLUMN payment_transactions.customer_email IS 'Customer email address';
COMMENT ON COLUMN payment_transactions.customer_phone IS 'Customer phone number';

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'payment_transactions'
ORDER BY ordinal_position;
