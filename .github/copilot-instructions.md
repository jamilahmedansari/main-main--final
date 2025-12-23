# Project Context

> **📖 For complete feature list, all 77 routes, and comprehensive patterns:** > **See `/workspace/AI_AGENTS_GUIDE.md`**

User → Letter Form → AI Draft (GPT-4 Turbo) → Admin Review → Approved PDF

## Tech Stack

Next.js 16 (App Router, React 19) | Supabase (Postgres + RLS) | OpenAI via Vercel AI SDK | Stripe | pnpm

## Application Overview

- **Total Features**: 100+ completed features (User, Employee, Admin)
- **Total Routes**: 77 routes (40 API endpoints + 37 page routes)
- **Database**: 11+ tables with full RLS policies
- **Status**: Production ready

## Role Authorization (Critical)

| Role         | Access                    | Constraint                                         |
| ------------ | ------------------------- | -------------------------------------------------- |
| `subscriber` | Own letters, subscription | First letter free, then credits                    |
| `employee`   | Own coupons, commissions  | **NO letter access** (RLS enforced)                |
| `admin`      | `/secure-admin-gateway/*` | **Single Admin only**. Env-based auth + portal key |

> ⚠️ `is_super_user` = unlimited letters, NOT admin privilege

### Single Admin Model (Critical)

- There is **exactly ONE admin account** who IS the licensed attorney:
  - **Reviewing, editing/improving, approving/rejecting** letters (attorney review)
  - Managing the **admin dashboard analytics**
  - Admin access is **only** via `/secure-admin-gateway/*` (separate portal session).
  - PDF shows "reviewed by a licensed attorney" when `role='admin'` reviews the letter
- **Employees are salespeople**, NOT lawyers - they sell the service but never access letters

## Supabase Client Pattern

```typescript
// Server (API routes, server components)
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();

// Client (React hooks)
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
```

## Letter Status Flow

`pending_review` → `under_review` (locked by admin) → `approved` (PDF ready) | `rejected` (needs info)
Always audit status changes: `await log_letter_audit(letter_id, user_id, action, details)`

## UI & Implementation

- Free trial: `count === 0` letters check before requiring subscription
- UI: shadcn/ui from `@/components/ui/*`, toast via `sonner`
- Admin routes: Verify with `isAdminAuthenticated()` from `lib/auth/admin-session.ts`

## Key Database Functions

- `check_letter_allowance(u_id)` → `{has_allowance, remaining, plan_name, is_super}`
- `deduct_letter_allowance(u_id)` → boolean (call after generation)
- `validate_coupon(code)` → validates employee coupon

## Commands

```bash
pnpm install && pnpm dev    # Development at localhost:3000
pnpm build                  # Must pass before deploy
pnpm lint                   # ESLint check
```

## Environment Variables (Do Not Paste Secrets)

Use [.env.example](../.env.example) as the source of truth. Put real values only in local/hosting env (e.g. `.env.local`, Vercel env vars) and never commit or paste secret values into repo docs.

Required / common runtime vars (names only):

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; never expose to client)
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_PORTAL_KEY`
- `CRON_SECRET`

Optional (rate limiting / Upstash):

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`
- `REDIS_URL`

Notes:

- `SUPABASE_ACCESS_TOKEN` is for the Supabase CLI (`supabase link`), not app runtime.
- Direct Postgres connection URLs should not be used by the Next.js app unless explicitly implemented; keep them out of frontend/runtime env.

## Security Rules

1. **RLS mandatory** - Never bypass with service role in user-facing code
2. **Employee isolation** - No letter content access (business requirement)
3. **Admin auth** - Separate system via `lib/auth/admin-session.ts` (30min timeout)

## Secure Admin Portal Routes

- `/secure-admin-gateway/login` - portal login (email/password + portal key)
- `/secure-admin-gateway/dashboard` - **single admin** dashboard (includes analytics)
- `/secure-admin-gateway/review` - review center
- `/secure-admin-gateway/review/[id]` - review a letter
- `/secure-admin-gateway/dashboard/letters` - review queue (admin only)
- `/secure-admin-gateway/dashboard/analytics` - analytics (admin only)
- `/secure-admin-gateway/dashboard/commissions` - commissions (admin only)
