-- Migration: Add settings and preferences columns to customers table
-- Run this after the main schema to add user settings support

ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP,
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS order_updates BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS promotional_emails BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sms_notifications BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS newsletter BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false;

-- Add comment to document the new columns
COMMENT ON COLUMN customers.email_notifications IS 'User preference for email notifications';
COMMENT ON COLUMN customers.order_updates IS 'User preference for order update notifications';
COMMENT ON COLUMN customers.promotional_emails IS 'User preference for promotional emails';
COMMENT ON COLUMN customers.sms_notifications IS 'User preference for SMS notifications';
COMMENT ON COLUMN customers.newsletter IS 'User preference for newsletter subscription';
COMMENT ON COLUMN customers.two_factor_enabled IS 'Whether two-factor authentication is enabled';
COMMENT ON COLUMN customers.is_deleted IS 'Soft delete flag for account deletion';
COMMENT ON COLUMN customers.deleted_at IS 'Timestamp when account was deleted';
