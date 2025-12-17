# Code-Documentation Alignment Report

## Mismatch #1: Plan Names
- **Document**: `DATABASE_FUNCTIONS.md` / `CLAUDE.md`
- **Section**: Plan Types / Pricing
- **Documented Behavior**:
    - `CLAUDE.md`: "Monthly Plan", "Yearly Plan"
    - `DATABASE_FUNCTIONS.md`: `monthly_standard`, `monthly_premium`
- **Actual Code** (`scripts/005_letter_allowance_system.sql`):
    - Uses `standard_4_month` and `premium_8_month`.
- **Fix Required**: Update documentation to match code (`standard_4_month`, `premium_8_month`) OR update code. Given "Yearly" implies 12 months, `premium_8_month` (if it means 8 letters per month?) or 8 letters per YEAR?
    - `CLAUDE.md`: "Yearly Plan: $599/year (8 letters included)" -> Total 8 letters for the whole year? Or per month?
    - `scripts/005`: `ELSIF plan = 'premium_8_month' THEN letters_to_add := 8;` (In `add_letter_allowances`)
    - `reset_monthly_allowances`: `WHEN plan_type = 'premium_8_month' THEN 8`.
    - So it resets monthly! So 8 letters *per month*?
    - `CLAUDE.md` says "8 letters included" (ambiguous if total or per month, but usually context implies per month if monthly plan is per month).
    - But price is $599/year.
    - If it resets monthly, that's 8 * 12 = 96 letters/year.
    - If it's 8 letters TOTAL for the year, `reset_monthly_allowances` SHOULD NOT include it.
    - **CRITICAL AMBIGUITY**: Does "Yearly Plan" get 8 letters *total* or 8 letters *per month*?
    - Logic in `reset_monthly_allowances` includes `premium_8_month`. So code thinks it's 8/month.
    - Docs "8 letters included" usually means total for the plan period.
    - FIX: Clarify if 8/month or 8/year.
    - **Resolution**: Assume Code is "Source of Truth" for behavior (8/month), but Naming is inconsistent. Update Docs to use `standard_4_month` etc. and clarify "8 letters/month".

## Mismatch #2: Admin Portal Location
- **Document**: `CLAUDE.md`, `PRODUCTION_CHECKLIST.md`
- **Section**: Admin Access
- **Documented Behavior**: Admin portal is at `/secure-admin-gateway`.
- **Actual Code**: `app/dashboard/layout.tsx` links to `/dashboard/admin`.
- **Investigation Needed**: Check if `/secure-admin-gateway` exists. If not, Docs are outdated. If it does, `dashboard/admin` might be a legacy or duplicate route.
- **Security Implication**: `/secure-admin-gateway` implies strict separate auth. `/dashboard/admin` might be integrated with standard user auth (Supabase Auth).
    - `lib/auth/admin-session.ts` supports `portalKey`, which suggests the strict auth is implemented.
    - We need to confirm WHICH route uses `admin-session.ts`.

## Mismatch #3: TypeScript Usage
- **Document**: `CLAUDE.md`
- **Section**: Common Gotchas
- **Documented Behavior**: "Use types from `lib/database.types.ts`, no `any`"
- **Actual Code**: `app/dashboard/layout.tsx` uses `useState<any>(null)`.
- **Fix Required**: Update code to use `Profile` type.

## Mismatch #4: Client-Side Layout Authorization
- **Document**: `CLAUDE.md` (Implicit in Role Authorization)
- **Actual Code**: `app/dashboard/layout.tsx` hides links but doesn't strictly redirect unauthorized users (server-side check likely exists but client-side could be stricter).

## Mismatch #5: Plan Pricing vs Letter Count
- **Document**: `CLAUDE.md` says "Yearly Plan: $599/year (8 letters included)".
- **Actual Code**: `app/api/create-checkout/route.ts` says `premium_8_month` has `letters: 8`.
- **Ambiguity**: Is it 8 total or 8 per month?
    - `reset_monthly_allowances` resets `premium_8_month` to 8. This implies 8 PER MONTH.
    - If 8 per month, then 96 letters/year.
    - Value proposition: $599 / 96 = ~$6/letter.
    - Documentation "8 letters included" sounds like "Total 8".
    - **Recommendation**: Clarify Docs to "8 letters per month".

## Action Plan
1. Update `CLAUDE.md` to reflect `/dashboard/admin` (if that is indeed the correct path) OR `/secure-admin-gateway`.
2. Update `CLAUDE.md` to clarify Plan details (Monthly vs Yearly vs Letter Counts).
3. Fix TypeScript `any` in Layout.
4. Verify `is_licensed_attorney` column exists (Added in migration 019).

## Mismatch #6: Admin Dashboard Security
- **Document**: `CLAUDE.md` ("Role Authorization")
- **Actual Code**: `app/dashboard/admin/page.tsx`
- **Issue**: The dashboard page fetches data without explicitly verifying if the current user is an admin.
- **Risk**: While RLS might protect the *data*, the *page structure* is accessible to anyone.
- **Fix Required**: Add `if (profile.role !== 'admin') redirect('/')` or similar check.

