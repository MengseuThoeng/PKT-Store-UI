-- Add is_admin column to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Set your account as admin (update with your email)
UPDATE customers SET is_admin = true WHERE email = 'rekiseu@gmail.com';

-- Create index for faster admin checks
CREATE INDEX IF NOT EXISTS idx_customers_is_admin ON customers(is_admin);

-- Verify
SELECT id, name, email, is_admin FROM customers WHERE is_admin = true;
