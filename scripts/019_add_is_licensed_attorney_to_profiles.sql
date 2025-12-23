-- ============================================================================
-- Script: 019_cleanup_is_licensed_attorney.sql
-- Purpose: Remove unused is_licensed_attorney column from profiles
-- 
-- Reason: 
--   - Only ONE admin exists in the system (the reviewing attorney)
--   - Admin is identified by role='admin' in profiles table
--   - Employees are salespeople, NOT lawyers - they never review letters
--   - No need for a separate is_licensed_attorney flag
--
-- Business Model:
--   - Subscriber: Creates letters (role='subscriber')
--   - Employee: Sells service via coupons (role='employee') - NO letter access
--   - Admin: Single licensed attorney who reviews all letters (role='admin')
-- ============================================================================

-- Remove the column if it exists (safe - uses IF EXISTS)
ALTER TABLE profiles 
DROP COLUMN IF EXISTS is_licensed_attorney;

-- Add clarifying comment to the role column
COMMENT ON COLUMN profiles.role IS 'User role: subscriber (creates letters), employee (sells service - NOT a lawyer), admin (single licensed attorney who reviews all letters)';
