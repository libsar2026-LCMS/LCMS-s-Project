# Contributing Guide — LCMS

Welcome to the LCMS codebase. This guide will help you get started as a developer on this project.

---

## Getting Started

1. Read [SETUP.md](./SETUP.md) to get the project running locally
2. Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the project structure
3. Read [DATABASE.md](./DATABASE.md) to understand the data model
4. Pick an issue or feature from the roadmap and create a branch

---

## Branch Naming

```
feature/what-you-are-building     e.g. feature/member-portal
fix/what-you-are-fixing           e.g. fix/profile-photo-upload
docs/what-you-are-documenting     e.g. docs/gallery-feature
```

Always branch from `develop`, not `main`.

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

---

## Commit Messages

Follow Conventional Commits format:

```
feat: short description of what was added
fix: short description of what was fixed
docs: documentation changes only
chore: dependency updates, config changes
refactor: code restructure without behavior change
style: formatting, no logic changes
```

Examples:
```
feat: add event registration form
fix: correct RLS policy on notifications table
docs: add gallery feature documentation
```

---

## Pull Request Process

1. Make sure your code runs without errors locally
2. Make sure ESLint passes: `npm run lint`
3. Make sure TypeScript compiles: `npm run build`
4. Open a pull request to the `develop` branch
5. Write a description of what you changed and why
6. Include screenshots for any UI changes
7. Request a review

---

## Code Standards

### TypeScript
- No `any` types — always define proper types
- Use types in `src/types/index.ts` for shared types
- Generate Supabase types with the CLI and put them in `src/types/database.ts`

### Components
- One component per file
- Named exports only (except `page.tsx` and `layout.tsx`)
- Use `"use client"` only when the component needs browser APIs or event handlers

### Server Actions
- All data mutations go through Server Actions in `src/actions/`
- Always validate with Zod before database operations
- Always handle errors and return meaningful messages

### Styling
- Tailwind CSS classes only — no inline styles
- Follow the design system colors defined in `tailwind.config.ts`
- Mobile-first: always start with base styles, then add `sm:`, `md:`, `lg:` overrides

### Forms
- Use React Hook Form for all forms
- Use Zod schemas from `src/lib/validations/` for validation
- Show clear error messages under each field

---

## Adding a New Feature

Follow this checklist for every new feature:

- [ ] Understand the user story and permissions required
- [ ] Design the UI before coding (sketch or describe it)
- [ ] Create or update the database table/migration if needed
- [ ] Add/update RLS policies for the new table
- [ ] Create the Zod validation schema in `src/lib/validations/`
- [ ] Create the Server Action in `src/actions/`
- [ ] Build the UI components
- [ ] Connect the form to the Server Action
- [ ] Test all edge cases (empty state, errors, loading)
- [ ] Test on mobile and desktop
- [ ] Add a documentation file in `docs/features/`

---

## Adding a New Page

1. Create the file in the correct route group under `src/app/`
2. Add SEO metadata using Next.js `export const metadata`
3. Protect the route if needed by updating `src/middleware.ts`
4. Add the route to the relevant navigation component

---

## Documentation

Every completed feature must have a file in `docs/features/`.

Use this template:

```markdown
# Feature Name

## What it does
Brief description.

## User flow
Step-by-step of how a user interacts with this feature.

## Files involved
- src/app/(public)/events/page.tsx
- src/components/public/EventCard.tsx
- src/actions/events.ts

## Database tables
- events
- event_registrations

## Permissions
Who can access this feature and what they can do.

## How to modify
Instructions for a future developer to extend this feature.
```

---

## Asking for Help

If you are stuck:
1. Re-read the relevant documentation files
2. Check the Supabase docs: https://supabase.com/docs
3. Check the Next.js docs: https://nextjs.org/docs
4. Check the shadcn/ui docs: https://ui.shadcn.com
5. Ask a senior developer on the team
