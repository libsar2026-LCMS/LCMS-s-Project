# Architecture — LCMS

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Folder Structure](#2-folder-structure)
3. [Authentication Flow](#3-authentication-flow)
4. [Application Flow](#4-application-flow)
5. [Role Permission Matrix](#5-role-permission-matrix)
6. [Navigation Structure](#6-navigation-structure)
7. [Design System](#7-design-system)
8. [Responsive Design Plan](#8-responsive-design-plan)
9. [Reusable Components](#9-reusable-components)
10. [Coding Standards](#10-coding-standards)
11. [Naming Conventions](#11-naming-conventions)

---

## 1. Technology Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | Next.js 15 | App Router, Server Components, Server Actions |
| Language | TypeScript | Type safety, maintainability |
| Styling | Tailwind CSS | Utility-first, consistent, fast |
| UI Components | shadcn/ui | Accessible, composable, unstyled base |
| Icons | Lucide React | Consistent with shadcn/ui |
| Backend | Supabase | Auth + PostgreSQL + Storage in one platform |
| Forms | React Hook Form + Zod | Performance + schema validation |
| Tables | TanStack Table | Headless, flexible data tables |
| Charts | Recharts | Simple, composable charts |
| Deployment | Vercel | Native Next.js support, preview deployments |
| Version Control | GitHub | Industry standard |

---

## 2. Folder Structure

```
lcms/
├── .env.local                        # Local environment variables (gitignored)
├── .env.example                      # Environment variable template (committed)
├── .eslintrc.json                    # ESLint configuration
├── .prettierrc                       # Prettier configuration
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json
│
├── public/
│   ├── logo.png
│   ├── og-image.png
│   └── icons/
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (public)/                 # Route group — public website
│   │   │   ├── page.tsx              # Home
│   │   │   ├── about/page.tsx
│   │   │   ├── leadership/page.tsx
│   │   │   ├── committees/page.tsx
│   │   │   ├── events/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── news/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── gallery/page.tsx
│   │   │   ├── documents/page.tsx
│   │   │   └── contact/page.tsx
│   │   │
│   │   ├── (auth)/                   # Route group — authentication
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── verify-email/page.tsx
│   │   │
│   │   ├── (portal)/                 # Route group — member portal
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── membership-card/page.tsx
│   │   │   ├── my-events/page.tsx
│   │   │   └── notifications/page.tsx
│   │   │
│   │   ├── (admin)/                  # Route group — admin dashboard
│   │   │   ├── layout.tsx
│   │   │   └── admin/
│   │   │       ├── page.tsx
│   │   │       ├── members/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/page.tsx
│   │   │       ├── leadership/page.tsx
│   │   │       ├── committees/page.tsx
│   │   │       ├── events/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/page.tsx
│   │   │       ├── news/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/page.tsx
│   │   │       ├── gallery/page.tsx
│   │   │       ├── documents/page.tsx
│   │   │       ├── users/page.tsx
│   │   │       └── settings/page.tsx
│   │   │
│   │   ├── api/
│   │   │   └── webhooks/
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui (auto-generated, do not edit)
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── PortalSidebar.tsx
│   │   ├── shared/                   # Used across multiple pages
│   │   │   ├── PageHeader.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   └── ImageUpload.tsx
│   │   ├── public/                   # Public website components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── NewsCard.tsx
│   │   │   ├── LeadershipCard.tsx
│   │   │   └── GalleryGrid.tsx
│   │   ├── portal/                   # Member portal components
│   │   │   ├── MembershipCard.tsx
│   │   │   └── NotificationItem.tsx
│   │   └── admin/                    # Admin-specific components
│   │       ├── StatsCard.tsx
│   │       ├── MemberTable.tsx
│   │       └── RichTextEditor.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser Supabase client
│   │   │   ├── server.ts             # Server Supabase client
│   │   │   └── middleware.ts         # Auth middleware helper
│   │   ├── validations/              # Zod schemas
│   │   │   ├── auth.ts
│   │   │   ├── member.ts
│   │   │   ├── event.ts
│   │   │   ├── news.ts
│   │   │   ├── gallery.ts
│   │   │   └── document.ts
│   │   └── utils.ts                  # General utility functions
│   │
│   ├── actions/                      # Next.js Server Actions
│   │   ├── auth.ts
│   │   ├── members.ts
│   │   ├── events.ts
│   │   ├── news.ts
│   │   ├── gallery.ts
│   │   ├── documents.ts
│   │   ├── contact.ts
│   │   └── settings.ts
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useUser.ts
│   │   ├── useRole.ts
│   │   └── useSupabase.ts
│   │
│   ├── types/
│   │   ├── database.ts               # Generated from Supabase CLI
│   │   └── index.ts                  # Application-level types
│   │
│   └── middleware.ts                 # Next.js route protection
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_create_tables.sql
│   │   ├── 002_rls_policies.sql
│   │   └── 003_triggers.sql
│   └── seed.sql
│
└── docs/
    ├── README.md
    ├── ROADMAP.md
    ├── SETUP.md
    ├── DATABASE.md
    ├── ARCHITECTURE.md
    ├── DEPLOYMENT.md
    ├── CONTRIBUTING.md
    └── features/
```

---

## 3. Authentication Flow

```
User visits protected route
        ↓
src/middleware.ts intercepts request
        ↓
Calls Supabase to check session
        ↓
No session?
  └── Redirect to /login
        ↓
Session exists?
  └── Fetch user role from public.users table
        ↓
Role insufficient for route?
  └── Redirect to /unauthorized
        ↓
Role sufficient?
  └── Allow request, render page
```

### Route Protection Rules

| Route Pattern | Minimum Role Required |
|--------------|----------------------|
| `/` and all public pages | None (public) |
| `/login`, `/register` | None (redirect if already logged in) |
| `/dashboard`, `/profile`, etc. | member |
| `/admin/*` | secretary |
| `/admin/users` | super_admin |
| `/admin/settings` | super_admin |

---

## 4. Application Flow

### Data Flow

```
User Action (Client Component)
        ↓
Server Action (src/actions/*.ts)
        ↓
Zod Validation
        ↓
Supabase Query (server client)
        ↓
RLS Policy Check (database level)
        ↓
Return result to component
        ↓
UI updates
```

### Key Rules
- Supabase queries run only in Server Components or Server Actions
- Client Components handle interactivity only
- Forms use React Hook Form (client) + Zod (client + server)
- Never use the service role key in client-side code

---

## 5. Role Permission Matrix

| Feature | Visitor | Member | Committee Head | Secretary | President | Super Admin |
|---------|:-------:|:------:|:--------------:|:---------:|:---------:|:-----------:|
| View public pages | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Member portal access | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit own profile | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View committee members | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Manage news & events | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage members | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage gallery & docs | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| View all statistics | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage user roles | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| System settings | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 6. Navigation Structure

### Public Navigation (Navbar)
```
[LIBSAR Logo]
Home | About | Leadership | Committees | Events | News | Gallery | Documents | Contact
                                                                         [Login Button]
```
Mobile: Hamburger menu with all links in a slide-down drawer.

### Member Portal Sidebar
```
[User Avatar + Name]
─────────────────
Dashboard
My Profile
Membership Card
My Events
Notifications
─────────────────
[Logout]
```

### Admin Sidebar
```
[LCMS Admin]
─────────────────
Dashboard
Members
Leadership
Committees
Events
News
Gallery
Documents
─────────────────
Users & Roles     ← super_admin only
Settings          ← super_admin only
─────────────────
[Back to Website]
```

---

## 7. Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#1B3A6B` | Navy — headers, primary buttons, sidebar |
| `primary-light` | `#2E5DA8` | Hover states, active links |
| `accent` | `#C8102E` | Red — CTAs, alerts, Liberian identity |
| `accent-light` | `#E63950` | Hover on accent buttons |
| `success` | `#16A34A` | Active status, confirmations |
| `warning` | `#D97706` | Warnings, pending states |
| `background` | `#F8FAFC` | Page background |
| `surface` | `#FFFFFF` | Cards, modals, panels |
| `border` | `#E2E8F0` | Dividers, card borders |
| `text-primary` | `#0F172A` | Main body text |
| `text-secondary` | `#64748B` | Captions, subtitles, placeholders |

The navy and red combination references the Liberian flag, reinforcing LIBSAR's identity.

### Typography

| Role | Font | Size | Weight |
|------|------|------|--------|
| H1 | Inter | 2.25rem (36px) | 700 |
| H2 | Inter | 1.875rem (30px) | 600 |
| H3 | Inter | 1.5rem (24px) | 600 |
| Body | Inter | 1rem (16px) | 400 |
| Small | Inter | 0.875rem (14px) | 400 |
| Caption | Inter | 0.75rem (12px) | 400 |

Font: Inter via `next/font/google`.

### Icons
Lucide React exclusively. Never mix icon libraries.

---

## 8. Responsive Design Plan

| Breakpoint | Width | Layout Behavior |
|-----------|-------|----------------|
| Mobile | < 640px | Single column, hamburger nav, stacked cards |
| Tablet | 640–1024px | Two columns, condensed nav |
| Desktop | > 1024px | Full multi-column layout, sidebars visible |

All components are built mobile-first using Tailwind prefixes: `sm:`, `md:`, `lg:`, `xl:`.

---

## 9. Reusable Components

| Component | Location | Used In |
|-----------|----------|---------|
| PageHeader | shared/ | All pages |
| EmptyState | shared/ | All list pages with no data |
| LoadingSpinner | shared/ | All async operations |
| ConfirmDialog | shared/ | All delete operations |
| ImageUpload | shared/ | Profile, gallery, news, events |
| DataTable | admin/ (TanStack) | Members, events, news lists |
| StatsCard | admin/ | Admin and portal dashboards |
| EventCard | public/ | Public events, portal events |
| NewsCard | public/ | Public news page |
| RichTextEditor | admin/ | News and event description fields |
| MembershipCard | portal/ | Member portal |

---

## 10. Coding Standards

- TypeScript strict mode — no `any` types
- One component per file
- Named exports only (no default exports except page.tsx and layout.tsx)
- Server Actions for all data mutations
- Supabase queries only in Server Components or Server Actions
- `"use client"` only when interactivity is required
- Zod validation on every form and Server Action
- No hardcoded strings — use constants or environment variables
- No inline styles — Tailwind classes only

---

## 11. Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `MemberCard.tsx` |
| Pages / Layouts | lowercase (Next.js standard) | `page.tsx`, `layout.tsx` |
| Hooks | camelCase with `use` prefix | `useRole.ts` |
| Server Actions | camelCase | `createEvent.ts` |
| Zod schemas | camelCase with `Schema` suffix | `memberSchema` |
| TypeScript types | PascalCase | `type MemberProfile` |
| Database tables | snake_case | `event_registrations` |
| Database columns | snake_case | `profile_photo_url` |
| Environment variables | SCREAMING_SNAKE_CASE | `NEXT_PUBLIC_SUPABASE_URL` |
| Routes / URLs | kebab-case | `/membership-card` |
| Git branches | kebab-case with prefix | `feature/member-portal` |
