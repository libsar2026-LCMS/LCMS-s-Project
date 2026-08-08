# Testing Strategy — LCMS

## Overview

Testing in LCMS is pragmatic — focused on correctness and confidence without over-engineering.
Early phases prioritize TypeScript type safety and manual testing.
Automated testing is introduced in Phase 7 before production deployment.

---

## Testing Layers

| Layer | Tool | When Applied |
|-------|------|-------------|
| Static type checking | TypeScript (strict) | Continuous — on every save |
| Linting | ESLint | On save + pre-commit hook |
| Formatting | Prettier | On save |
| Unit tests | Vitest | Per utility function and validation schema |
| Component tests | Vitest + React Testing Library | Per shared component |
| End-to-end tests | Playwright | Before production deployment |
| Manual testing | Browser | After completing each phase |

---

## What to Test

### Phase 1 — Auth (Manual)
- [ ] Register with valid data → success message
- [ ] Register with duplicate email → error shown
- [ ] Login with wrong password → error shown
- [ ] Login with correct credentials → redirected to portal
- [ ] Forgot password → email received, link works
- [ ] Access `/dashboard` without login → redirected to `/login`
- [ ] Access `/admin` as member → redirected to unauthorized

### Phase 2 — Public Website (Manual)
- [ ] All 9 public pages load without errors
- [ ] Navbar links work correctly
- [ ] Mobile hamburger menu opens and closes
- [ ] Contact form submits → success message shown
- [ ] Event detail page loads with correct data
- [ ] News detail page loads with correct data

### Phase 3 — Member Portal (Manual)
- [ ] Profile form submits and saves
- [ ] Profile photo uploads and displays correctly
- [ ] Membership card shows correct member data
- [ ] My Events shows registered events
- [ ] Notifications marked as read on click

### Phase 4 — Admin Core (Manual)
- [ ] Member table loads with all members
- [ ] Search by name filters correctly
- [ ] Filter by university filters correctly
- [ ] Create new member → appears in table
- [ ] Edit member → changes saved
- [ ] Delete member → removed with confirmation
- [ ] Create event → appears on public events page
- [ ] Publish news → appears on public news page

### Phase 5 — Admin Extended (Manual)
- [ ] Upload photo to album → appears in public gallery
- [ ] Upload document → downloadable from public documents page
- [ ] Add leadership entry → appears on public leadership page

### Phase 6 — Roles (Manual)
- [ ] Super admin can change user roles
- [ ] Committee head cannot access `/admin`
- [ ] Secretary can access `/admin` but not `/admin/users`
- [ ] Settings update and persist correctly

---

## Unit Testing (Vitest)

Focus unit tests on:
- Zod validation schemas (test valid and invalid inputs)
- Utility functions in `src/lib/utils.ts`
- Membership ID generation logic

Example test file: `src/lib/validations/member.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { memberSchema } from './member'

describe('memberSchema', () => {
  it('accepts valid member data', () => {
    const result = memberSchema.safeParse({
      full_name: 'John Doe',
      gender: 'male',
      university: 'University of Rwanda',
      // ...
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty full_name', () => {
    const result = memberSchema.safeParse({ full_name: '' })
    expect(result.success).toBe(false)
  })
})
```

---

## End-to-End Testing (Playwright)

Run before every production deployment.

Key user flows to automate:

1. **Visitor flow** — Visit home, browse events, read news, submit contact form
2. **Member auth flow** — Register, verify email, log in, view dashboard
3. **Member profile flow** — Update profile, upload photo
4. **Admin flow** — Log in as admin, create event, publish news, view members

---

## Running Tests

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# All checks before PR
npm run lint && npx tsc --noEmit && npm run test
```

---

## Pre-Commit Hook

Configure Husky to run lint and type check before every commit:

```bash
npm install --save-dev husky lint-staged
npx husky init
```

`.husky/pre-commit`:
```bash
npx lint-staged
```

`package.json`:
```json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
}
```
