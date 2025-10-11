#!/bin/bash
# Script to comment out debug console.logs while keeping console.error

echo "í·¹ Commenting out debug console.logs in production files..."

# Files to clean
files=(
  "app/api/payment/khqr/route.ts"
  "app/api/orders/create/route.ts"
  "app/api/admin/orders/[orderId]/status/route.ts"
  "lib/services/email.ts"
  "lib/services/khqr.ts"
  "lib/services/telegram.ts"
  "lib/context/AuthContext.tsx"
  "app/api/orders/route.ts"
  "lib/utils/get-auth.ts"
  "lib/services/bakong-verify.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Checking $file..."
    # Count console.log occurrences
    count=$(grep -c "console\.log\|console\.warn" "$file" 2>/dev/null || echo 0)
    echo "  Found $count debug logs"
  fi
done

echo "âœ… Analysis complete! Manual cleanup recommended for selective commenting."
