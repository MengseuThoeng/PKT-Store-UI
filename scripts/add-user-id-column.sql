-- Add user_id column to customers table for auth integration
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS user_id UUID;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);

-- Note: user_id will be the same as customer id for existing customers
-- Or linked to auth.users if using Supabase Auth
