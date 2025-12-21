# AI Documentation Index

This document serves as a directory for all AI assistant instruction files in this project.

---

## Master Reference Document

### 📖 [`AI_AGENTS_GUIDE.md`](./AI_AGENTS_GUIDE.md) - **START HERE**

**The complete master reference for all AI coding assistants.**

**Contains:**
- ✅ **Complete feature list** (100+ features across User, Employee, Admin roles)
- ✅ **All 77 routes** (40 API endpoints + 37 page routes)
- ✅ **Critical architecture rules** (5 critical rules you must follow)
- ✅ **Development patterns** (API routes, database queries, TypeScript, components)
- ✅ **Database reference** (tables, functions, RLS policies)
- ✅ **Security & compliance** (RLS, GDPR, audit trails)
- ✅ **AI integration guide** (OpenAI via Vercel AI SDK)
- ✅ **Common workflows** (complete examples for key operations)

**Use this when:**
- Starting work on this project
- Need to understand the full feature set
- Looking for specific routes or endpoints
- Need architecture patterns and examples
- Implementing new features
- Reviewing code structure

---

## AI-Specific Instruction Files

### 🎯 [`.cursorrules`](./.cursorrules)

**For: Cursor IDE**

Concise rules file optimized for Cursor IDE's AI assistant. Contains quick reference for critical rules, common patterns, and project structure.

**Contains:**
- Critical rules summary
- Standard code patterns
- Common gotchas
- Project structure overview
- Links to master reference

---

### 🤖 [`.github/copilot-instructions.md`](./.github/copilot-instructions.md)

**For: GitHub Copilot**

Concise project context for GitHub Copilot. Focuses on role authorization, letter workflow, and admin portal security.

**Contains:**
- Project overview
- Role authorization rules
- Letter status workflow
- Supabase client patterns
- Security rules
- Secure admin portal routes
- Environment variables

---

### 💻 [`.copilot-codeGeneration-instructions.md`](./.copilot-codeGeneration-instructions.md)

**For: GitHub Copilot (Detailed)**

Comprehensive code generation guide with detailed patterns, examples, and architectural decisions.

**Contains:**
- Complete tech stack details
- Detailed file structure map
- Routes & endpoints reference
- Role authorization examples
- Middleware & sessions details
- Letter lifecycle flow
- AI integration patterns (OpenAI via Vercel AI SDK)
- Subscriber flow (free trial, subscriptions)
- Employee coupons & commissions
- TypeScript best practices
- Component patterns
- API route conventions
- Security best practices
- Development environment setup
- **Extension philosophy** (critical - not a greenfield project)

**Use this when:**
- Writing new API routes
- Implementing AI features
- Working with authentication
- Managing subscriptions
- Building UI components

---

### 📋 [`CLAUDE.md`](./CLAUDE.md)

**For: Claude AI / General Reference**

Quick reference guide for AI assistants. Concise summary of critical information.

**Contains:**
- Project summary
- Tech stack
- Critical role authorization rules
- Letter status workflow
- Supabase client patterns
- API route patterns
- Key database functions
- Project structure
- Commands
- Security checklist
- Common gotchas

**Use this when:**
- Need a quick reminder of critical rules
- Looking up database functions
- Need command reference
- Quick security checklist

---

## Specialized Documentation

### 🔧 [`manual_fix_instructions.md`](./manual_fix_instructions.md)

**For: Database Manual Fixes**

Contains specific manual fixes for database functions that can't be applied via automated scripts.

**Contains:**
- `create_employee_coupon` function search_path fix
- Manual SQL fixes for Supabase dashboard
- Verification queries

**Use this when:**
- Encountering database function security issues
- Applying manual database fixes
- Verifying database function configurations

---

## Documentation Decision Tree

```
┌─ Need complete feature list? ──────────────────────────> AI_AGENTS_GUIDE.md
│
├─ Using Cursor IDE? ───────────────────────────────────> .cursorrules
│
├─ Using GitHub Copilot? ──────────────────────────────> .github/copilot-instructions.md
│                                                          OR .copilot-codeGeneration-instructions.md
│
├─ Using Claude AI? ────────────────────────────────────> CLAUDE.md
│
├─ Need quick reference? ──────────────────────────────> CLAUDE.md
│
├─ Writing new code/features? ─────────────────────────> AI_AGENTS_GUIDE.md (patterns)
│                                                          + .copilot-codeGeneration-instructions.md
│
├─ Database issues? ────────────────────────────────────> manual_fix_instructions.md
│
└─ Not sure? Start here ───────────────────────────────> AI_AGENTS_GUIDE.md
```

---

## File Hierarchy by Detail Level

### 🔵 Quick Reference (30 seconds)
- `CLAUDE.md` - Essential rules and patterns

### 🟢 Standard Reference (5 minutes)
- `.cursorrules` - Cursor IDE rules
- `.github/copilot-instructions.md` - Copilot context

### 🟡 Comprehensive Reference (15 minutes)
- `AI_AGENTS_GUIDE.md` - **Master reference**
- `.copilot-codeGeneration-instructions.md` - Detailed patterns

### 🟠 Specialized (As needed)
- `manual_fix_instructions.md` - Database fixes

---

## Cross-Reference Strategy

All instruction files reference the master document (`AI_AGENTS_GUIDE.md`) for:
- Complete feature list
- All routes and endpoints
- Comprehensive patterns and examples

This ensures:
✅ **Single source of truth** for features and routes
✅ **Consistency** across all AI assistants
✅ **Easy maintenance** - update master, others reference it
✅ **Reduced duplication** - concise files for quick reference

---

## Maintenance Notes

### When Adding Features
1. ✅ Update `AI_AGENTS_GUIDE.md` with new feature/route
2. ✅ Update code generation patterns if needed
3. ⚠️ Other files auto-reference master - no update needed

### When Changing Architecture
1. ✅ Update `AI_AGENTS_GUIDE.md` critical rules section
2. ✅ Update `.cursorrules` if rule affects day-to-day coding
3. ✅ Update other files if fundamental change

### When Adding Routes
1. ✅ Add to `AI_AGENTS_GUIDE.md` "All Routes & Endpoints" section
2. ✅ Categorize by role (Public/Auth/User/Employee/Admin)
3. ⚠️ Other files reference master - no update needed

---

## Quick Stats

| File | Lines | Purpose | Audience |
|------|-------|---------|----------|
| `AI_AGENTS_GUIDE.md` | ~1200 | Master reference | All AI assistants |
| `.cursorrules` | ~200 | Quick patterns | Cursor IDE |
| `.github/copilot-instructions.md` | ~100 | Context | GitHub Copilot |
| `.copilot-codeGeneration-instructions.md` | ~1200 | Detailed patterns | GitHub Copilot |
| `CLAUDE.md` | ~170 | Quick reference | Claude AI / General |
| `manual_fix_instructions.md` | ~100 | DB fixes | Database maintenance |

---

## Application Summary

**Talk-To-My-Lawyer** - AI-powered legal letter SaaS with mandatory attorney review

### Key Metrics
- **Features**: 100+ completed features
- **Routes**: 77 total (40 API + 37 pages)
- **Roles**: 3 (Subscriber, Employee, Admin)
- **Database**: 11+ tables with full RLS
- **Status**: ✅ Production ready

### Tech Stack
- Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- Supabase (PostgreSQL + RLS + Auth)
- Stripe payments
- OpenAI GPT-4 Turbo via Vercel AI SDK
- pnpm package manager

### Critical Rules (Always Follow)
1. **Extension, not reconstruction** - App is 95% complete
2. **Role authorization** - `is_super_user` ≠ admin
3. **Letter status workflow** - Always audit transitions
4. **Supabase client usage** - Server vs client
5. **Admin authentication** - Separate two-layer system

---

**Last Updated**: 2025-12-21
**Version**: 1.0.0

For questions or updates, see individual documentation files.
