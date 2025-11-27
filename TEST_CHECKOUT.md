# Test Mode Checkout Guide

## Current Configuration
✅ Test Mode: **ENABLED** (`ENABLE_TEST_MODE=true`)
✅ Dev Server: Running on **http://localhost:3003**

## How to Test Checkout

### 1. Create an Account
- Go to http://localhost:3003
- Click "Get Started" or "Sign Up"
- Create a new account with email/password
- You'll be redirected to the dashboard

### 2. Test Free Checkout (100% Discount)
- Go to Subscription page
- Enter coupon code: **TALK3**
- Click "Apply Coupon"
- You should see: "100% discount - $0"
- Click "Subscribe"
- ✅ Subscription created instantly (no Stripe)
- ✅ You get unlimited letters (super user)

### 3. Test Paid Checkout (With Test Mode)
- Create a new account (or clear subscription)
- Go to Subscription page
- Select any plan (Single, Monthly, or Yearly)
- Click "Subscribe"
- ✅ Payment will be simulated instantly
- ✅ Subscription created without Stripe
- ✅ Credits added to your account

### 4. Verify Subscription
- Go to `/dashboard/subscription`
- You should see:
  - Active subscription
  - Letter credits remaining
  - Subscription details

## What Test Mode Does
- ✅ Bypasses Stripe completely
- ✅ Creates subscription immediately in database
- ✅ Adds letter credits to account
- ✅ Tracks coupon usage (if used)
- ✅ Creates employee commissions (if applicable)
- ✅ Returns success response instantly

## Before Running SQL Migration

**Important:** You need to run `scripts/012_add_promo_coupons.sql` in Supabase to add the TALK3 coupon:

```sql
-- Add promotional coupon codes
INSERT INTO employee_coupons (
  employee_id, 
  code, 
  discount_percent, 
  is_active,
  usage_count
) VALUES (
  NULL,  -- No employee (promo code)
  'TALK3',
  100,
  true,
  0
) ON CONFLICT (code) DO UPDATE SET
  discount_percent = 100,
  is_active = true;
```

### How to Run Migration:
1. Go to your Supabase project dashboard
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Paste the SQL from `scripts/012_add_promo_coupons.sql`
5. Click "Run"

## Switching to Production Mode

When ready for real payments:
1. Update `.env.local`: `ENABLE_TEST_MODE=false`
2. Add Stripe test keys: `STRIPE_SECRET_KEY=sk_test_...`
3. Restart dev server
4. Stripe checkout will work normally

## Troubleshooting

### Error: "Failed to load resource: 406"
- **Cause:** TALK3 coupon doesn't exist in database
- **Fix:** Run the SQL migration above

### Error: "Failed to create checkout: 500"
- **Cause:** Missing environment variables or database error
- **Fix:** Check server logs with `npm run dev`

### Success Response Format
```json
{
  "success": true,
  "testMode": true,
  "subscriptionId": "uuid-here",
  "letters": 4,
  "message": "TEST MODE: Subscription created successfully (simulated payment)",
  "redirectUrl": "/dashboard/subscription?success=true&test=true"
}
```

## Next Steps
1. ✅ Run SQL migration to add TALK3 coupon
2. ✅ Test signup flow
3. ✅ Test subscription with TALK3 code
4. ✅ Test subscription without coupon
5. ✅ Verify letter generation works with credits
