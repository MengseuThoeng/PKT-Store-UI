-- Add missing columns to payment_transactions table for KHQR integration

ALTER TABLE payment_transactions
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- Add comment
COMMENT ON COLUMN payment_transactions.customer_email IS 'Customer email address';
COMMENT ON COLUMN payment_transactions.customer_phone IS 'Customer phone number';
