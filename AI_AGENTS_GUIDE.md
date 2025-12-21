# AI Agents Development Guide - Talk-To-My-Lawyer

> **Master reference for all AI coding assistants (Claude, Copilot, Cursor, etc.)**
>
> This document contains the complete feature set, architecture, routes, and development patterns for the Talk-To-My-Lawyer application.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Complete Feature List](#complete-feature-list)
- [All Routes & Endpoints](#all-routes--endpoints)
- [Critical Architecture Rules](#critical-architecture-rules)
- [Development Patterns](#development-patterns)
- [Database Reference](#database-reference)
- [Security & Compliance](#security--compliance)
- [AI Integration Guide](#ai-integration-guide)
- [Common Workflows](#common-workflows)

---

## Project Overview

**Talk-To-My-Lawyer** is an AI-powered legal letter SaaS platform with mandatory attorney review.

### User Flow
```
User → Letter Form → AI Draft (GPT-4 Turbo) → Admin Review → PDF Download/Email
```

### Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL + RLS + Auth), Stripe, OpenAI via Vercel AI SDK
- **Package Manager**: pnpm
- **Deployment**: Vercel (primary), Docker support available

### Three-Role System

| Role | Database Value | Access Level | Primary Routes |
|------|---------------|--------------|----------------|
| **Subscriber** | `subscriber` | Own letters, subscription, profile | `/dashboard/*` |
| **Employee** | `employee` | Own coupons, commissions, referrals | `/dashboard/commissions`, `/dashboard/coupons` |
| **Admin** | `admin` | Full system access | `/secure-admin-gateway/*` |

---

## Complete Feature List

### ✅ User/Subscriber Features

#### Authentication & Account Management
- ✅ User signup with email/password
- ✅ User login/logout
- ✅ Forgot password / Reset password flow
- ✅ Email verification
- ✅ Profile creation and management
- ✅ Account settings
- ✅ GDPR compliance (export data, delete account, privacy policy)

#### Dashboard & Overview
- ✅ User dashboard with stats overview
- ✅ "My Letters" page (view all user's letters)
- ✅ Individual letter detail view
- ✅ Letter status timeline (4-step visual tracker)
- ✅ Subscription status and management page
- ✅ Billing history page

#### Letter Generation System
- ✅ Guided multi-step letter creation form
- ✅ AI-powered letter generation (OpenAI GPT-4 Turbo via Vercel AI SDK)
- ✅ Letter improvement/editing capability
- ✅ Draft letters support (save and resume)
- ✅ Letter type selection (multiple letter types supported)
- ✅ Intake data collection (sender, recipient, issue, desired outcome)
- ✅ Free trial system (first letter free)
- ✅ Letter allowance/credits system

#### Letter Status Workflow
```
draft → generating → pending_review → under_review → approved → completed
                                                   ↘ rejected (with feedback)
```
- ✅ Real-time status tracking
- ✅ Timeline visualization
- ✅ Status change notifications
- ✅ Unapproved letters hidden from users (security compliance)
- ✅ Rejected letters with admin feedback
- ✅ Resubmit capability for rejected letters

#### Letter Actions (Approved Letters Only)
- ✅ Preview letter content online
- ✅ Download letter as PDF
- ✅ Send letter via email
- ✅ Delete letters
- ✅ View audit trail (history of changes)

#### Subscription & Payments (Stripe Integration)
- ✅ Stripe checkout session creation
- ✅ Payment verification flow
- ✅ Stripe webhook handling
- ✅ Three pricing tiers:
  - Single letter ($299 one-time)
  - 4 letters/year ($299/year)
  - 8 letters/year ($599/year)
- ✅ Letter credit/allowance tracking
- ✅ Subscription status display
- ✅ Monthly allowance reset (automated cron job)
- ✅ Billing history view

---

### ✅ Employee Features

#### Dashboard & Overview
- ✅ Employee dashboard with performance stats
- ✅ Referrals tracking page
- ✅ Commissions overview page
- ✅ Payouts management page
- ✅ Employee settings page

#### Coupon/Referral System
- ✅ Automatic coupon code generation on employee signup
- ✅ Unique coupon format: `EMP-XXXXXX` (6-char hash)
- ✅ 20% discount for users using employee codes
- ✅ Referral link generation API
- ✅ Coupon usage tracking
- ✅ View all coupon redemptions
- ✅ Coupon analytics (usage count, total revenue)

#### Commission System
- ✅ Automatic commission calculation (5% of purchase)
- ✅ Points system (1 point per coupon use)
- ✅ Commission status tracking (pending → paid)
- ✅ Payout request system
- ✅ Commission history view
- ✅ Earnings dashboard

#### Security & Isolation
- ✅ **CRITICAL**: Employees NEVER have access to letter content
- ✅ RLS policies enforce employee isolation
- ✅ Employee-specific database views
- ✅ Audit trail for employee actions

---

### ✅ Admin Features

#### Admin Authentication (Separate System)
- ✅ Dedicated admin login portal (`/secure-admin-gateway/login`)
- ✅ Dual authentication:
  - Email/password (from ENV variables)
  - Admin portal key (additional security layer)
- ✅ Separate admin session management (30-minute timeout)
- ✅ Admin logout functionality
- ✅ Session verification middleware

#### Admin Dashboard
- ✅ Comprehensive analytics dashboard
- ✅ System-wide metrics and KPIs
- ✅ User statistics (total users, subscribers, employees)
- ✅ Revenue tracking
- ✅ Letter statistics (by status, by type)
- ✅ Recent activity feed

#### Letter Review System
- ✅ Review queue (all pending letters)
- ✅ Letter review interface with rich text editor
- ✅ AI-powered improvement suggestions
- ✅ Start review action (locks letter for admin)
- ✅ Approve letter with final content
- ✅ Reject letter with detailed feedback
- ✅ Request additional information from user
- ✅ Mark letter as completed
- ✅ Batch operations on multiple letters
- ✅ Letter search and filtering
- ✅ Full audit trail for all letter actions

#### User Management
- ✅ View all users
- ✅ User role management (view only - roles set on signup)
- ✅ User search and filtering
- ✅ View user subscription status
- ✅ View user letter history
- ✅ Manage super user status (unlimited letters flag)

#### Coupon & Commission Management
- ✅ View all employee coupons
- ✅ Create new coupon codes
- ✅ Activate/deactivate coupons
- ✅ View coupon usage analytics
- ✅ Commission overview for all employees
- ✅ Process commission payouts
- ✅ Commission analytics and reporting

#### Email Queue Management
- ✅ Email queue dashboard
- ✅ View pending/sent emails
- ✅ Retry failed email deliveries
- ✅ Email delivery status tracking
- ✅ Manual email queue processing

#### System Administration
- ✅ System health monitoring
- ✅ Database query optimization
- ✅ Fraud detection tables (configured)
- ✅ Security audit logs
- ✅ System configuration management

---

### ✅ Backend/Infrastructure Features

#### Database (Supabase PostgreSQL)
- ✅ Complete normalized schema with 11+ tables
- ✅ Row Level Security (RLS) on all tables
- ✅ Role-based access policies
- ✅ Database functions for complex operations
- ✅ Triggers for automation (coupon generation, audit trails)
- ✅ Enum types for status fields
- ✅ Full-text search capabilities
- ✅ Database migrations system

#### Core Tables
```
- profiles (users, roles, settings)
- subscriptions (plans, credits, status)
- letters (content, status, metadata)
- letter_audit_trail (change history)
- employee_coupons (coupon codes)
- coupon_usage (redemption tracking)
- commissions (employee earnings)
- email_queue (email delivery system)
- fraud_detection (security monitoring)
- security_audit_log (system events)
- security_config (system settings)
```

#### Database Functions (Key)
- ✅ `check_letter_allowance(u_id)` - Check if user can generate letter
- ✅ `deduct_letter_allowance(u_id)` - Deduct one letter credit
- ✅ `log_letter_audit(...)` - Create audit trail entry
- ✅ `validate_coupon(code)` - Validate employee coupon
- ✅ `get_user_role(u_id)` - Get user's role
- ✅ `create_employee_coupon(emp_id)` - Auto-generate employee coupon

#### API Architecture
- ✅ 40+ RESTful API endpoints
- ✅ Next.js App Router (route.ts convention)
- ✅ Comprehensive error handling
- ✅ Request validation
- ✅ Rate limiting (configured)
- ✅ CORS configuration
- ✅ API authentication via Supabase Auth
- ✅ Admin-only API endpoints with separate auth

#### Security Features
- ✅ Row Level Security (RLS) enforcement
- ✅ Password hashing (bcrypt)
- ✅ Secure session management
- ✅ Environment variable security
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Search path security on all functions
- ✅ Audit logging for sensitive operations
- ✅ Fraud detection infrastructure

#### Email System
- ✅ Email queue for reliable delivery
- ✅ Email templates
- ✅ Retry logic for failed emails
- ✅ Email status tracking
- ✅ Cron job for queue processing

#### Payment Integration (Stripe)
- ✅ Checkout session creation
- ✅ Payment verification
- ✅ Webhook handling
- ✅ Subscription management
- ✅ Invoice generation
- ✅ Refund support (infrastructure ready)

---

### ✅ UI/UX Features

#### Component Library
- ✅ Full shadcn/ui component library integration
- ✅ Custom components:
  - SubscriptionModal
  - GenerationTrackerModal
  - ReviewLetterModal
  - ReviewStatusModal
  - LetterActions
  - CouponCard
  - DashboardLayout
  - RichTextEditor
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support (infrastructure ready)
- ✅ Toast notifications (via Sonner)
- ✅ Loading skeletons
- ✅ Error boundaries

#### User Experience
- ✅ Timeline animations for letter status
- ✅ Real-time status updates
- ✅ Form validation with helpful error messages
- ✅ Loading states for all async operations
- ✅ Optimistic UI updates
- ✅ Empty states with helpful CTAs
- ✅ Confirmation dialogs for destructive actions
- ✅ Keyboard navigation support
- ✅ Accessibility (ARIA labels, semantic HTML)

---

## All Routes & Endpoints

### Summary
| Category | Count |
|----------|-------|
| **API Endpoints** | **40** |
| **Page Routes** | **37** |
| **Total Routes** | **77** |

---

### API Endpoints (40 Total)

#### Admin Authentication (2)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/admin-auth/login` | Public | Admin portal login (email + password + portal key) |
| POST | `/api/admin-auth/logout` | Admin Session | Destroy admin session |

#### Admin Management (8)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/analytics` | Admin Session | Get dashboard analytics |
| GET | `/api/admin/coupons` | Admin Session | List all coupons |
| POST | `/api/admin/coupons/create` | Admin Session | Create new coupon |
| GET | `/api/admin/email-queue` | Admin Session | Get email queue status |
| GET | `/api/admin/letters` | Admin Session | Get all letters (admin view) |
| POST | `/api/admin/letters/batch` | Admin Session | Batch operations on letters |
| GET | `/api/admin/users` | Admin Session | Get all users (implied from features) |
| POST | `/api/admin/super-user` | Admin Session | Manage super user status |

#### User Authentication (3)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/reset-password` | Public | Request password reset email |
| POST | `/api/auth/update-password` | Reset Token | Update password with reset token |
| POST | `/api/create-profile` | Supabase Auth | Create/update user profile |

#### Stripe/Payments (3)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/create-checkout` | Supabase Auth | Create Stripe checkout session |
| POST | `/api/stripe/webhook` | Stripe Signature | Handle Stripe webhooks |
| GET/POST | `/api/verify-payment` | Supabase Auth | Verify payment success |

#### Subscriptions (4)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/subscriptions/activate` | Supabase Auth | Activate subscription |
| GET | `/api/subscriptions/billing-history` | Supabase Auth | Get billing history |
| GET | `/api/subscriptions/check-allowance` | Supabase Auth | Check remaining letter allowance |
| POST | `/api/subscriptions/reset-monthly` | Cron Secret | Reset monthly allowances (cron) |

#### Letters (3)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/generate-letter` | Supabase Auth | Generate new letter via AI |
| GET | `/api/letters/drafts` | Supabase Auth | Get user's draft letters |
| POST | `/api/letters/improve` | Admin | Improve letter content via AI |

#### Letter Actions (by ID) (11)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/letters/[id]/approve` | Admin Session | Admin approves letter |
| GET | `/api/letters/[id]/audit` | Supabase Auth | Get letter audit trail |
| POST | `/api/letters/[id]/complete` | Admin Session | Mark letter as completed |
| DELETE | `/api/letters/[id]/delete` | Supabase Auth | Delete a letter (owner only) |
| POST | `/api/letters/[id]/improve` | Admin Session | Improve specific letter |
| GET | `/api/letters/[id]/pdf` | Supabase Auth | Download letter as PDF |
| POST | `/api/letters/[id]/reject` | Admin Session | Admin rejects letter |
| POST | `/api/letters/[id]/resubmit` | Supabase Auth | User resubmits rejected letter |
| POST | `/api/letters/[id]/send-email` | Supabase Auth | Send letter via email |
| POST | `/api/letters/[id]/start-review` | Admin Session | Admin starts reviewing letter |
| POST | `/api/letters/[id]/submit` | Supabase Auth | Submit letter for review |

#### Employee (2)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET/POST | `/api/employee/payouts` | Supabase Auth (Employee) | Get/request employee payouts |
| GET | `/api/employee/referral-link` | Supabase Auth (Employee) | Get employee referral link |

#### GDPR Compliance (3)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/gdpr/accept-privacy-policy` | Supabase Auth | Accept privacy policy |
| POST | `/api/gdpr/delete-account` | Supabase Auth | Delete user account & all data |
| GET | `/api/gdpr/export-data` | Supabase Auth | Export all user data (JSON) |

#### Health & Cron (3)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | Public | Basic health check |
| GET | `/api/health/detailed` | Public | Detailed health check with DB status |
| GET | `/api/cron/process-email-queue` | Cron Secret | Process queued emails (cron job) |

---

### Page Routes (37 Total)

#### Public Pages (1)
| Route | Description | Access |
|-------|-------------|--------|
| `/` | Landing page / Home | Public |

#### Authentication Pages (5)
| Route | Description | Access |
|-------|-------------|--------|
| `/auth/login` | User login page | Public |
| `/auth/signup` | User signup page | Public |
| `/auth/forgot-password` | Forgot password page | Public |
| `/auth/reset-password` | Reset password page (with token) | Public |
| `/auth/check-email` | Check email verification page | Public |

#### User Dashboard (6)
| Route | Description | Access |
|-------|-------------|--------|
| `/dashboard` | User dashboard home | Authenticated |
| `/dashboard/letters` | My Letters list | Subscriber |
| `/dashboard/letters/new` | Create new letter form | Subscriber |
| `/dashboard/letters/[id]` | View specific letter details | Subscriber (owner) |
| `/dashboard/subscription` | Subscription management | Subscriber |
| `/dashboard/billing` | Billing history | Subscriber |

#### Employee Dashboard (5)
| Route | Description | Access |
|-------|-------------|--------|
| `/dashboard/referrals` | Employee referrals tracking | Employee |
| `/dashboard/commissions` | Employee commissions page | Employee |
| `/dashboard/payouts` | Employee payouts page | Employee |
| `/dashboard/coupons` | Employee coupons page | Employee |
| `/dashboard/employee-settings` | Employee settings | Employee |

#### Admin Portal (10)
| Route | Description | Access |
|-------|-------------|--------|
| `/secure-admin-gateway` | Admin gateway redirect | Admin Session |
| `/secure-admin-gateway/login` | Admin login page | Public |
| `/secure-admin-gateway/dashboard` | Admin dashboard home | Admin Session |
| `/secure-admin-gateway/dashboard/users` | Manage all users | Admin Session |
| `/secure-admin-gateway/dashboard/letters` | Manage all letters | Admin Session |
| `/secure-admin-gateway/dashboard/all-letters` | View all letters list | Admin Session |
| `/secure-admin-gateway/dashboard/analytics` | Analytics dashboard | Admin Session |
| `/secure-admin-gateway/dashboard/coupons` | Manage coupons | Admin Session |
| `/secure-admin-gateway/dashboard/commissions` | View commissions | Admin Session |
| `/secure-admin-gateway/dashboard/email-queue` | Email queue management | Admin Session |

#### Admin Review System (2)
| Route | Description | Access |
|-------|-------------|--------|
| `/secure-admin-gateway/review` | Letter review queue | Admin Session |
| `/secure-admin-gateway/review/[id]` | Review specific letter | Admin Session |

#### Legacy/Blocked Routes (8)
| Route | Description | Status |
|-------|-------------|--------|
| `/dashboard/admin/*` | Legacy admin pages | **Blocked by middleware** |
| `/admin/*` | Alternate admin UI | **Deprecated** |

---

## Critical Architecture Rules

### ⚠️ RULE #1: Extension, Not Reconstruction

**This is NOT a greenfield project. The app is 95% complete.**

✅ **DO:**
- Add new API endpoints in existing `app/api/` structure
- Create new components following existing patterns
- Add new pages under existing route groups
- Extend database schema with NEW migrations
- Wire up incomplete features
- Add validation and error handling

❌ **DON'T:**
- Rebuild routing or folder structure
- Replace existing UI components
- Drop/recreate database tables
- Rewrite working features
- Create new admin role systems
- Change tech stack

---

### ⚠️ RULE #2: Role Authorization

#### Three Roles, One Admin

| Role | Database | Access | Critical Rule |
|------|----------|--------|---------------|
| `subscriber` | `role='subscriber'` | Own letters, subscription | First letter free, then credits |
| `employee` | `role='employee'` | Own coupons, commissions | **NEVER access letter content** |
| `admin` | `role='admin'` | Full system access | **Only ONE admin in system** |

#### is_super_user vs admin (CRITICAL!)

```typescript
// ❌ WRONG - is_super_user is NOT admin
if (profile.is_super_user) { /* admin logic */ }

// ✅ CORRECT - is_super_user means unlimited letters ONLY
if (profile.is_super_user) { /* skip credit check */ }

// ✅ CORRECT - admin check
if (profile.role === 'admin') { /* admin logic */ }
```

**Key Points:**
- `is_super_user` is a **business flag** for unlimited letter allowance
- `is_super_user` does NOT grant admin portal access
- Always use `role = 'admin'` for authorization checks
- Never create UI to promote users to admin
- There is exactly ONE admin user (seeded via script)

---

### ⚠️ RULE #3: Letter Status Workflow

```
draft → generating → pending_review → under_review → approved → completed
                                                   ↘ rejected
```

#### Status Rules (CRITICAL)
1. **Unapproved letters**: Content HIDDEN from subscriber (show "Under Review")
2. **Approved letters**: Full content visible, PDF/email enabled
3. **All transitions**: MUST log via `log_letter_audit()`
4. **Admin review**: Only admin can approve/reject
5. **Employee isolation**: Employees never see letter content (enforced by RLS)

```typescript
// ALWAYS audit status changes
await supabase.rpc('log_letter_audit', {
  p_letter_id: letterId,
  p_action: 'approved',
  p_old_status: 'under_review',
  p_new_status: 'approved',
  p_notes: 'Approved by admin'
})
```

---

### ⚠️ RULE #4: Supabase Client Usage

```typescript
// Server components/API routes - ALWAYS use server client
import { createClient } from "@/lib/supabase/server"
const supabase = await createClient()

// Client components ONLY
import { createClient } from "@/lib/supabase/client"
const supabase = createClient()
```

**Never:**
- Use service role key in user-facing code
- Bypass RLS policies
- Use client in server-side code
- Use server client in client components

---

### ⚠️ RULE #5: Admin Authentication (Two-Layer)

#### Separate Admin Portal System

**Admin session is SEPARATE from Supabase Auth:**
1. Admin logs in via `/secure-admin-gateway/login`
2. Requires: email + password + portal key (all from ENV)
3. Creates separate cookie-based session
4. 30-minute timeout
5. Middleware protects all `/secure-admin-gateway/*` routes

```typescript
// Admin portal check
import { isAdminAuthenticated } from "@/lib/auth/admin-session"

const isAdmin = await isAdminAuthenticated()
if (!isAdmin) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
}
```

**Never:**
- Create multiple admin accounts
- Allow signup as admin
- Bypass portal key requirement
- Use Supabase role alone for admin auth

---

## Development Patterns

### API Route Standard Pattern

```typescript
import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Auth check
    const { data: { user }, error } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // 2. Role check (if needed)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile.role !== 'subscriber') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // 3. Parse and validate input
    const body = await request.json()
    // ... validation

    // 4. Business logic (RLS auto-enforces access)
    const { data, error: dbError } = await supabase
      .from("letters")
      .insert({ user_id: user.id, ...body })
      .select()
      .single()

    if (dbError) throw dbError

    // 5. Response
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("[API] Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

---

### Database Query Pattern

```typescript
// ✅ CORRECT - Use RPC functions for business logic
const { data: allowance } = await supabase.rpc('check_letter_allowance', {
  u_id: userId
})

if (!allowance.has_allowance && !allowance.is_super) {
  return NextResponse.json({ needsSubscription: true }, { status: 403 })
}

// ✅ CORRECT - RLS auto-filters by user
const { data: letters } = await supabase
  .from("letters")
  .select("*")
  .eq("user_id", userId)

// ❌ WRONG - Don't bypass RLS
const { data: letters } = await adminClient // service role
  .from("letters")
  .select("*") // This bypasses RLS!
```

---

### TypeScript Pattern

```typescript
import { Database } from "@/lib/database.types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type Letter = Database["public"]["Tables"]["letters"]["Row"]
type LetterStatus = Database["public"]["Enums"]["letter_status"]

// Use proper types
interface LetterResponse {
  letter: Letter
  aiDraft: string
  isFreeTrial: boolean
}

// Never use 'any' without justification
const response: LetterResponse = await generateLetter(data)
```

---

### Component Pattern

```typescript
'use client' // Only if needed for interactivity

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface LetterCardProps {
  letter: Letter
  onView?: (id: string) => void
}

export function LetterCard({ letter, onView }: LetterCardProps) {
  return (
    <Card>
      <h3>{letter.letter_type}</h3>
      <p>Status: {letter.status}</p>
      <Button onClick={() => onView?.(letter.id)}>
        View Details
      </Button>
    </Card>
  )
}
```

---

## Database Reference

### Key Tables

```sql
-- Users and profiles
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'subscriber', -- subscriber | employee | admin
  is_super_user BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ
)

-- Subscriptions
subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles,
  plan_type TEXT, -- one_time | monthly | yearly
  status TEXT, -- active | cancelled | expired
  credits_remaining INTEGER,
  stripe_subscription_id TEXT
)

-- Letters
letters (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles,
  letter_type TEXT NOT NULL,
  status letter_status NOT NULL, -- enum
  intake_data JSONB,
  ai_draft_content TEXT,
  final_content TEXT,
  admin_feedback TEXT,
  created_at TIMESTAMPTZ
)

-- Audit trail
letter_audit_trail (
  id UUID PRIMARY KEY,
  letter_id UUID REFERENCES letters,
  user_id UUID REFERENCES profiles,
  action TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ
)

-- Employee coupons
employee_coupons (
  id UUID PRIMARY KEY,
  employee_id UUID REFERENCES profiles,
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER DEFAULT 20,
  is_active BOOLEAN DEFAULT true
)

-- Commissions
commissions (
  id UUID PRIMARY KEY,
  employee_id UUID REFERENCES profiles,
  amount DECIMAL,
  status TEXT, -- pending | paid
  coupon_code TEXT,
  order_id TEXT
)
```

### Key Functions

```sql
-- Check if user can generate a letter
check_letter_allowance(u_id UUID)
RETURNS TABLE(has_allowance BOOLEAN, remaining INTEGER, plan_name TEXT, is_super BOOLEAN)

-- Deduct one letter credit
deduct_letter_allowance(u_id UUID)
RETURNS BOOLEAN

-- Log audit trail entry
log_letter_audit(
  p_letter_id UUID,
  p_action TEXT,
  p_old_status TEXT,
  p_new_status TEXT,
  p_notes TEXT
) RETURNS VOID

-- Validate employee coupon
validate_coupon(code TEXT)
RETURNS TABLE(valid BOOLEAN, discount_percent INTEGER, employee_id UUID)

-- Get user role
get_user_role(u_id UUID)
RETURNS TEXT
```

---

## Security & Compliance

### Row Level Security (RLS)

**All tables MUST have RLS enabled:**

```sql
-- Enable RLS
ALTER TABLE letters ENABLE ROW LEVEL SECURITY;

-- Subscribers see own letters only
CREATE POLICY "subscribers_view_own_letters"
ON letters FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() AND
  get_user_role(auth.uid()) = 'subscriber'
);

-- Employees NEVER see letters
CREATE POLICY "employees_no_letter_access"
ON letters FOR ALL
TO authenticated
USING (
  get_user_role(auth.uid()) != 'employee'
);

-- Admin sees all letters
CREATE POLICY "admin_view_all_letters"
ON letters FOR ALL
TO authenticated
USING (
  get_user_role(auth.uid()) = 'admin'
);
```

### Security Checklist

- ✅ RLS enabled on all tables
- ✅ Password hashing (bcrypt)
- ✅ Secure session management
- ✅ Environment variables for secrets
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection (React auto-escapes)
- ✅ CSRF protection (SameSite cookies)
- ✅ Search path security on all functions
- ✅ Audit logging for sensitive operations
- ✅ Employee isolation from letter content
- ✅ Admin portal separate authentication

### GDPR Compliance

```typescript
// Export all user data
GET /api/gdpr/export-data
Returns: JSON with all user data (profile, letters, subscriptions, etc.)

// Delete user account
POST /api/gdpr/delete-account
- Deletes all user data
- Anonymizes audit trails
- Cancels subscriptions
- Removes from all tables

// Privacy policy acceptance
POST /api/gdpr/accept-privacy-policy
- Records acceptance timestamp
- Updates profile
```

---

## AI Integration Guide

### Current Implementation

**Provider:** OpenAI GPT-4 Turbo via Vercel AI SDK

**Architecture:**
```
Client → Next.js API Route → Vercel AI SDK → OpenAI GPT-4 → Response
```

**Benefits:**
- ✅ Type-safe end-to-end
- ✅ Built-in streaming support
- ✅ Single deployment pipeline
- ✅ Excellent DX with Vercel AI SDK
- ✅ No extra microservices

### Standard AI Pattern

```typescript
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Auth check
    const { data: { user }, error } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // 2. Validate API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("[AI] Missing OPENAI_API_KEY")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    // 3. Build prompt
    const prompt = buildPrompt(/* your params */)

    // 4. Call OpenAI via Vercel AI SDK
    const { text: generatedContent } = await generateText({
      model: openai("gpt-4-turbo"),
      system: "You are a professional legal attorney drafting formal legal letters...",
      prompt,
      temperature: 0.7,
      maxTokens: 2048,
    })

    // 5. Validate response
    if (!generatedContent) {
      throw new Error("AI returned empty content")
    }

    // 6. Return result
    return NextResponse.json({ content: generatedContent })
  } catch (error: any) {
    console.error("[AI] Generation error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

### Letter Generation Pattern

```typescript
// Create letter with 'generating' status
const { data: newLetter } = await supabase
  .from("letters")
  .insert({
    user_id: user.id,
    letter_type: letterType,
    status: "generating",
    intake_data: intakeData,
  })
  .select()
  .single()

try {
  // Generate letter using AI
  const { text: generatedContent } = await generateText({
    model: openai("gpt-4-turbo"),
    system: "You are a professional legal attorney...",
    prompt: buildPrompt(letterType, intakeData),
    temperature: 0.7,
    maxTokens: 2048,
  })

  // Update letter with generated content
  await supabase
    .from("letters")
    .update({
      ai_draft_content: generatedContent,
      status: "pending_review",
    })
    .eq("id", newLetter.id)

  // Log audit trail
  await supabase.rpc("log_letter_audit", {
    p_letter_id: newLetter.id,
    p_action: "created",
    p_old_status: "generating",
    p_new_status: "pending_review",
    p_notes: "Letter generated successfully by AI",
  })

  return NextResponse.json({
    success: true,
    letterId: newLetter.id,
    aiDraft: generatedContent,
  })
} catch (error) {
  // Mark as failed on error
  await supabase
    .from("letters")
    .update({ status: "failed" })
    .eq("id", newLetter.id)

  throw error
}
```

### AI Best Practices

1. **System Prompts**: Define AI's role clearly
2. **Temperature**: Use 0.7 for balanced creativity/consistency
3. **Max Tokens**: Set to 2048 for letter content
4. **Error Handling**: Always wrap in try-catch
5. **Validation**: Check for empty responses
6. **Audit Trail**: Log all AI operations
7. **Security**: Never expose API key to client

### AI Rules

- ✅ Use Vercel AI SDK (`@ai-sdk/openai` and `ai`)
- ✅ Use `gpt-4-turbo` model for legal content
- ✅ Validate `OPENAI_API_KEY` before calling
- ✅ Handle errors gracefully with status updates
- ✅ Log all AI operations
- ❌ Never call OpenAI from client-side
- ❌ Never expose `OPENAI_API_KEY` in client code
- ❌ Never use raw `fetch` to OpenAI
- ❌ Never skip error handling

---

## Common Workflows

### 1. User Generates Letter (Free Trial)

```typescript
// Check allowance
const { data: allowance } = await supabase.rpc('check_letter_allowance', { u_id: userId })

// First letter is free
const existingLetters = await supabase
  .from("letters")
  .select("id")
  .eq("user_id", userId)

const isFreeTrial = existingLetters.length === 0

if (!isFreeTrial && !allowance.has_allowance && !allowance.is_super) {
  return NextResponse.json({ needsSubscription: true }, { status: 403 })
}

// Generate letter (see AI Integration Guide)
// ...

// Deduct credit (if not free trial)
if (!isFreeTrial && !allowance.is_super) {
  await supabase.rpc('deduct_letter_allowance', { u_id: userId })
}
```

### 2. Admin Reviews Letter

```typescript
// Start review (lock letter)
await supabase
  .from("letters")
  .update({ status: "under_review" })
  .eq("id", letterId)

await supabase.rpc("log_letter_audit", {
  p_letter_id: letterId,
  p_action: "review_started",
  p_old_status: "pending_review",
  p_new_status: "under_review",
  p_notes: "Admin started review",
})

// Approve letter
await supabase
  .from("letters")
  .update({
    status: "approved",
    final_content: editedContent
  })
  .eq("id", letterId)

await supabase.rpc("log_letter_audit", {
  p_letter_id: letterId,
  p_action: "approved",
  p_old_status: "under_review",
  p_new_status: "approved",
  p_notes: "Letter approved by admin",
})
```

### 3. Employee Coupon Redemption

```typescript
// Validate coupon
const { data: coupon } = await supabase.rpc('validate_coupon', {
  code: couponCode
})

if (!coupon.valid) {
  return NextResponse.json({ error: "Invalid coupon" }, { status: 400 })
}

// Apply discount in Stripe checkout
const session = await stripe.checkout.sessions.create({
  // ... other params
  discounts: [{
    coupon: couponCode // 20% off
  }]
})

// On successful payment (webhook):
// 1. Record coupon usage
await supabase
  .from("coupon_usage")
  .insert({
    coupon_id: coupon.id,
    user_id: userId,
    order_id: session.id
  })

// 2. Create commission
await supabase
  .from("commissions")
  .insert({
    employee_id: coupon.employee_id,
    amount: session.amount_total * 0.05, // 5%
    status: "pending",
    coupon_code: couponCode,
    order_id: session.id
  })
```

### 4. Subscription Purchase

```typescript
// Create Stripe checkout
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{
    price: priceId, // from Stripe dashboard
    quantity: 1,
  }],
  success_url: `${baseUrl}/verify-payment?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${baseUrl}/dashboard/subscription`,
  metadata: {
    userId: user.id,
    planType: 'monthly' // or 'yearly'
  }
})

// On webhook (successful payment):
await supabase
  .from("subscriptions")
  .insert({
    user_id: userId,
    plan_type: planType,
    status: "active",
    credits_remaining: planType === 'monthly' ? 4 : 8,
    stripe_subscription_id: subscription.id
  })
```

---

## Environment Variables

**Required in `.env.local`:**

```bash
# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx... # Server-only, never expose to client

# OpenAI (Vercel AI SDK)
OPENAI_API_KEY=sk-xxx...

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx...
STRIPE_WEBHOOK_SECRET=whsec_xxx...

# Admin Portal
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password_here
ADMIN_PORTAL_KEY=random_secure_key_here

# Cron Jobs
CRON_SECRET=random_cron_secret_here

# Optional (Rate Limiting / Upstash)
KV_REST_API_URL=https://xxx.upstash.io
KV_REST_API_TOKEN=Axxxx...
KV_REST_API_READ_ONLY_TOKEN=Axxxx...
REDIS_URL=redis://xxx.upstash.io
```

---

## Commands

```bash
# Install dependencies
pnpm install

# Development server (localhost:3000)
pnpm dev

# Production build (must pass before deploy)
pnpm build

# ESLint check
pnpm lint

# Type check
pnpm type-check

# Run Supabase locally
supabase start

# Create new migration
supabase migration new <migration_name>

# Apply migrations
supabase db push

# Generate TypeScript types
supabase gen types typescript --local > lib/database.types.ts
```

---

## Project Structure (Key Paths)

```
talk-to-my-lawyer/
├── app/
│   ├── api/                    # API routes (40 endpoints)
│   │   ├── admin-auth/         # Admin authentication
│   │   ├── admin/              # Admin management APIs
│   │   ├── auth/               # User auth APIs
│   │   ├── cron/               # Cron job endpoints
│   │   ├── employee/           # Employee APIs
│   │   ├── gdpr/               # GDPR compliance APIs
│   │   ├── generate-letter/    # AI letter generation
│   │   ├── letters/            # Letter management APIs
│   │   ├── stripe/             # Stripe webhooks
│   │   └── subscriptions/      # Subscription APIs
│   ├── auth/                   # Auth pages (login, signup, etc.)
│   ├── dashboard/              # User/Employee dashboard
│   │   ├── letters/            # Letter management UI
│   │   ├── subscription/       # Subscription UI
│   │   ├── commissions/        # Employee commissions
│   │   └── coupons/            # Employee coupons
│   ├── secure-admin-gateway/   # Admin portal (separate auth)
│   │   ├── login/              # Admin login
│   │   ├── dashboard/          # Admin dashboard
│   │   └── review/             # Letter review system
│   └── page.tsx                # Landing page
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── dashboard-layout.tsx    # Main layout
│   ├── review-letter-modal.tsx # Admin review UI
│   └── ...                     # Other components
├── lib/
│   ├── auth/                   # Auth utilities
│   │   ├── admin-session.ts    # Admin session management
│   │   └── get-user.ts         # User fetching
│   ├── supabase/               # Supabase clients
│   │   ├── server.ts           # Server client
│   │   ├── client.ts           # Client client
│   │   └── middleware.ts       # Session middleware
│   └── database.types.ts       # Generated DB types
├── supabase/
│   └── migrations/             # Database migrations
│       ├── 001_*.sql           # Initial schema
│       ├── 002_*.sql           # RLS policies
│       └── ...                 # Other migrations
├── scripts/
│   └── create-admin-user.ts    # Admin user creation
├── .env.local                  # Environment variables
├── .env.example                # Example env file
├── CLAUDE.md                   # Quick reference guide
├── AI_AGENTS_GUIDE.md          # This file (master reference)
└── package.json                # Dependencies
```

---

## Common Gotchas

1. **Free Trial**: Check `count === 0` letters before requiring subscription
2. **Letter Credits**: Call `deduct_letter_allowance(u_id)` after generation (if not free trial)
3. **Admin Routes**: Use `isAdminAuthenticated()` from `lib/auth/admin-session.ts`
4. **UI Components**: Use `@/components/ui/*` (shadcn/ui), toast via `sonner`
5. **TypeScript**: Use types from `lib/database.types.ts`, avoid `any`
6. **Employee Isolation**: Employees NEVER see letter content (enforced by RLS)
7. **Supabase Client**: Use server client in API routes, client client in React components
8. **Admin Auth**: Separate portal session, not just Supabase role
9. **is_super_user**: Business flag for unlimited letters, NOT admin authorization
10. **Letter Status**: Always log transitions via `log_letter_audit()`

---

## Support Resources

- **Main Guide**: `/workspace/CLAUDE.md`
- **Copilot Instructions**: `/workspace/.github/copilot-instructions.md`
- **Code Generation Guide**: `/workspace/.copilot-codeGeneration-instructions.md`
- **Database Functions**: See migration files in `supabase/migrations/`
- **Free Trial Docs**: `/workspace/FREE_TRIAL_IMPLEMENTATION.md`

---

## Development Philosophy

### Extension, Not Reconstruction

**This app is 95% complete. Your job is to:**
- ✅ Add missing features
- ✅ Fix bugs
- ✅ Improve existing code
- ✅ Wire up incomplete functionality
- ✅ Add validation and error handling

**Your job is NOT to:**
- ❌ Rebuild the architecture
- ❌ Replace working systems
- ❌ Redesign the database
- ❌ Change the tech stack
- ❌ Refactor working code "to make it better"

### Pattern Matching

Before writing new code:
1. **Search** for similar existing functionality
2. **Copy** the patterns you find
3. **Extend** with your specific logic
4. **Stay consistent** with existing code

### Code Quality

- Match existing code style
- Add comments only where logic isn't self-evident
- Keep solutions simple and focused
- Only add error handling for realistic scenarios
- Trust framework guarantees (Next.js, Supabase)

---

**Last Updated**: 2025-12-21
**App Version**: 1.0.0 (Production Ready)
**Total Features**: 100+ completed features
**Total Routes**: 77 routes (40 API + 37 pages)
