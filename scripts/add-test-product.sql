-- Add a $0.01 test product to Supabase for KHQR testing
-- Run this in Supabase SQL Editor

-- First, check if it already exists
SELECT id, name, price FROM plushies WHERE price = 0.01;

-- If not exists, insert it
-- (If it already exists, you'll see it in the query above!)
INSERT INTO plushies (
  name,
  character,
  series,
  price,
  original_price,
  discount_percentage,
  image,
  description,
  stock_count,
  rating,
  reviews_count,
  size,
  material,
  is_featured,
  is_new,
  category,
  created_at,
  updated_at
) 
SELECT 
  'Test Plushie - KHQR Test 🧪',
  'Test Character',
  'Test Series',
  0.01,
  0.05,
  80,
  '/plushie/pikachu.png',
  '🧪 TEST PRODUCT - Only $0.01 for KHQR payment testing! Perfect for testing your payment integration without spending real money.',
  999,
  5.0,
  100,
  'Tiny (1 inch)',
  'Digital Test Material',
  true,
  true,
  'Test Products',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM plushies WHERE price = 0.01
);

-- Verify it's there
SELECT id, name, price, stock_count, is_featured FROM plushies WHERE price = 0.01;
