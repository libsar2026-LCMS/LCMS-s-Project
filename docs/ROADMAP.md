# LCMS — Complete Software Development Roadmap

## Table of Contents

1. [Project Analysis](#1-project-analysis)
2. [System Requirements](#2-system-requirements)
3. [User Stories](#3-user-stories)
4. [System Modules](#4-system-modules)
5. [Development Phases](#5-development-phases)
6. [Roadmap Summary](#6-roadmap-summary)

---

## 1. Project Analysis

LCMS is a community management platform for a Liberian student organization based in Rwanda.

### Core Challenges
- Professional enough to be production-ready
- Simple enough for future student developers to maintain
- Multiple user roles with varying access levels
- Both a public-facing website and a private member/admin portal
- Supabase handles auth, database, and storage — reducing backend complexity significantly
- Vercel + Next.js = serverless-first, eliminating server management burden

### Scale Assumptions
- Community size: under 500 members
- Scalability concerns: moderate
- Primary users: students with varying technical literacy

---

## 2. System Requirements

### Functional Requirements

| # | Requirement |
|---|-------------|
| F1 | Public website accessible without login |
| F2 | Member registration and profile management |
| F3 | Role-based access control (6 roles) |
| F4 | Event creation, publishing, and registration |
| F5 | News and announcement publishing |
| F6 | Photo gallery with albums |
| F7 | Document storage and downloads |
| F8 | Member portal with dashboard and membership card |
| F9 | Admin dashboard with full content management |
| F10 | Search and filter members by multiple criteria |
| F11 | Committee and leadership management |
| F12 | Digital membership card generation |

### Non-Functional Requirements

| # | Requirement |
|---|-------------|
| NF1 | Page load under 3 seconds on average connection |
| NF2 | Mobile-first responsive design |
| NF3 | WCAG 2.1 AA accessibility compliance |
| NF4 | Secure authentication with email verification |
| NF5 | Row-Level Security on all database tables |
| NF6 | Zero-downtime deployments via Vercel |
| NF7 | 99.9% uptime leveraging Supabase and Vercel infrastructure |
| NF8 | All secrets in environment variables, never in code |
| NF9 | TypeScript strict mode throughout |
| NF10 | Codebase understandable by intermediate developers |

---

## 3. User Stories

### Visitor
- As a visitor, I can browse the public website to learn about LIBSAR
- As a visitor, I can view upcoming events without logging in
- As a visitor, I can read news and announcements
- As a visitor, I can download public documents
- As a visitor, I can contact LIBSAR via a contact form

### Member
- As a member, I can log in and view my dashboard
- As a member, I can update my profile and photo
- As a member, I can download my digital membership card
- As a member, I can register for events
- As a member, I can view private announcements

### Committee Head
- As a committee head, I can view members in my committee
- As a committee head, I can post committee-specific updates

### Secretary General
- As the secretary general, I can manage members and their records
- As the secretary general, I can publish news and events
- As the secretary general, I can manage documents and gallery

### President
- As the president, I can access all content management features
- As the president, I can view all reports and statistics

### Super Admin
- As a super admin, I can manage user roles and system settings
- As a super admin, I can access all data and override any content

---

## 4. System Modules

```
LCMS
├── Public Website
│   ├── Home
│   ├── About
│   ├── Leadership
│   ├── Committees
│   ├── Events (public)
│   ├── News (public)
│   ├── Gallery
│   ├── Documents (public)
│   └── Contact
├── Auth
│   ├── Login
│   ├── Register
│   ├── Forgot Password
│   └── Email Verification
├── Member Portal
│   ├── Dashboard
│   ├── Profile
│   ├── Membership Card
│   ├── My Events
│   └── Notifications
└── Admin Dashboard
    ├── Overview / Stats
    ├── Members
    ├── Leadership
    ├── Committees
    ├── Events
    ├── News
    ├── Gallery
    ├── Documents
    ├── Users & Roles
    └── Settings
```

---

## 5. Development Phases

---

### Phase 0 — Project Setup

**Goal:** Working development environment with all dependencies configured.

**Features:**
- Next.js 15 project initialized with TypeScript
- Tailwind CSS + shadcn/ui installed and configured
- ESLint + Prettier configured
- Supabase project created (dev instance)
- GitHub repository created with branch strategy
- Environment variables documented

**Deliverables:**
- Working app on localhost:3000
- All config files in place
- Supabase connection verified

**Files:**
```
next.config.ts
tailwind.config.ts
tsconfig.json
.env.local
.env.example
.eslintrc.json
.prettierrc
src/lib/supabase/client.ts
src/lib/supabase/server.ts
```

**Testing:**
- App runs on localhost:3000 without errors
- Supabase client connects successfully

**Expected Result:** Clean, configured project ready for feature development.

---

### Phase 1 — Database & Authentication

**Goal:** All database tables created, RLS enabled, auth working end-to-end.

**Features:**
- All SQL migration files applied to Supabase
- Supabase Auth configured (email/password)
- Login page
- Register page
- Forgot Password page
- Email verification flow
- Middleware protecting routes by role
- Auto-create profile on user signup (Supabase DB trigger)

**Deliverables:**
- All tables exist in Supabase with RLS policies
- User can register, verify email, and log in
- Protected routes redirect unauthenticated users
- Role-based redirects working

**Files:**
```
supabase/migrations/001_create_tables.sql
supabase/migrations/002_rls_policies.sql
supabase/migrations/003_triggers.sql
src/middleware.ts
src/app/(auth)/login/page.tsx
src/app/(auth)/register/page.tsx
src/app/(auth)/forgot-password/page.tsx
src/app/(auth)/verify-email/page.tsx
src/lib/validations/auth.ts
src/actions/auth.ts
src/hooks/useUser.ts
src/hooks/useRole.ts
```

**Database Changes:** All tables created. See DATABASE.md.

**Testing:**
- Register a new user → receives verification email
- Verify email → redirected to portal
- Access /admin without auth → redirected to /login
- Access /admin as member → redirected to /unauthorized

**Expected Result:** Secure authentication flow fully operational.

---

### Phase 2 — Public Website

**Goal:** Fully functional public-facing website.

**Features:**
- Home page with hero, stats, featured events, news
- About page
- Leadership page
- Committees page
- Events listing and detail pages
- News listing and detail pages
- Gallery page with albums
- Documents page with public downloads
- Contact page with form

**Deliverables:**
- All 9 public pages functional and responsive
- SEO metadata on all pages
- Contact form saves to database
- Mobile hamburger menu working

**Files:**
```
src/app/(public)/page.tsx
src/app/(public)/about/page.tsx
src/app/(public)/leadership/page.tsx
src/app/(public)/committees/page.tsx
src/app/(public)/events/page.tsx
src/app/(public)/events/[slug]/page.tsx
src/app/(public)/news/page.tsx
src/app/(public)/news/[slug]/page.tsx
src/app/(public)/gallery/page.tsx
src/app/(public)/documents/page.tsx
src/app/(public)/contact/page.tsx
src/components/layout/Navbar.tsx
src/components/layout/Footer.tsx
src/components/public/HeroSection.tsx
src/components/public/EventCard.tsx
src/components/public/NewsCard.tsx
src/components/public/LeadershipCard.tsx
src/components/public/GalleryGrid.tsx
src/actions/contact.ts
```

**Database Changes:** Reads from events, news, gallery, documents, leadership, committees. Writes to contact_messages.

**Testing:**
- All pages render on mobile, tablet, desktop
- Contact form submits and saves to Supabase
- Event and news detail pages load correctly
- No broken links

**Expected Result:** Professional public website fully visible to visitors.

---

### Phase 3 — Member Portal

**Goal:** Logged-in members can manage their profile and access member features.

**Features:**
- Portal layout with responsive sidebar
- Dashboard (welcome, announcements, upcoming events)
- Profile edit form
- Profile photo upload
- Digital membership card
- My Events page (registered events)
- Notifications page

**Deliverables:**
- All portal pages functional
- Profile updates save correctly
- Photo upload to Supabase Storage works
- Membership card displays member info

**Files:**
```
src/app/(portal)/layout.tsx
src/app/(portal)/dashboard/page.tsx
src/app/(portal)/profile/page.tsx
src/app/(portal)/membership-card/page.tsx
src/app/(portal)/my-events/page.tsx
src/app/(portal)/notifications/page.tsx
src/components/layout/PortalSidebar.tsx
src/components/portal/MembershipCard.tsx
src/components/portal/NotificationItem.tsx
src/components/shared/ImageUpload.tsx
src/lib/validations/member.ts
src/actions/members.ts
```

**Database Changes:** Read/write profiles, event_registrations, notifications.

**Testing:**
- Member updates profile → changes saved and reflected
- Photo upload → image appears in profile
- Membership card shows correct member data
- Notifications marked as read when viewed

**Expected Result:** Members have a functional self-service portal.

---

### Phase 4 — Admin Dashboard (Core)

**Goal:** Admins can manage members, events, and news.

**Features:**
- Admin layout with sidebar
- Dashboard with statistics and charts
- Member management table with search, filter, pagination
- Member create / edit / view / delete
- Event management (full CRUD)
- News management (full CRUD with rich text)

**Deliverables:**
- Admin dashboard accessible to secretary, president, super_admin
- Member table with TanStack Table (search, filter, sort, paginate)
- Event and news CRUD fully working
- Charts showing member and event statistics

**Files:**
```
src/app/(admin)/admin/page.tsx
src/app/(admin)/admin/members/page.tsx
src/app/(admin)/admin/members/[id]/page.tsx
src/app/(admin)/admin/events/page.tsx
src/app/(admin)/admin/events/[id]/page.tsx
src/app/(admin)/admin/news/page.tsx
src/app/(admin)/admin/news/[id]/page.tsx
src/app/(admin)/layout.tsx
src/components/layout/AdminSidebar.tsx
src/components/admin/StatsCard.tsx
src/components/admin/MemberTable.tsx
src/components/admin/RichTextEditor.tsx
src/components/shared/ConfirmDialog.tsx
src/lib/validations/event.ts
src/lib/validations/news.ts
src/actions/events.ts
src/actions/news.ts
```

**Database Changes:** Full CRUD on profiles, events, news.

**Testing:**
- Search members by name, university, county — results filter correctly
- Create event → appears on public events page
- Publish news → appears on public news page
- Delete with confirmation dialog works
- Role check: members cannot access /admin

**Expected Result:** Core admin operations fully functional.

---

### Phase 5 — Admin Dashboard (Extended)

**Goal:** Gallery, documents, leadership, and committees management.

**Features:**
- Gallery album creation and photo upload
- Document upload, categorization, and management
- Leadership management (positions, academic year, current/past)
- Committee management (create, assign head, add members)

**Deliverables:**
- Gallery fully manageable from admin
- Documents uploadable and categorized
- Leadership board manageable per academic year
- Committees with assigned heads

**Files:**
```
src/app/(admin)/admin/gallery/page.tsx
src/app/(admin)/admin/documents/page.tsx
src/app/(admin)/admin/leadership/page.tsx
src/app/(admin)/admin/committees/page.tsx
src/actions/gallery.ts
src/actions/documents.ts
src/lib/validations/gallery.ts
src/lib/validations/document.ts
```

**Database Changes:** CRUD on gallery_albums, gallery_photos, documents, leadership, committees.

**Testing:**
- Upload photo to album → appears in public gallery
- Upload document → downloadable from public documents page
- Add leadership entry → appears on public leadership page
- Create committee → visible in admin and public committees page

**Expected Result:** All content types fully manageable from admin.

---

### Phase 6 — Roles, Settings & Polish

**Goal:** Full role enforcement, system settings, and UI polish.

**Features:**
- User role management (Super Admin only)
- System settings (site name, contact info, social links)
- Notification creation and management
- Empty states for all list pages
- Error boundaries on all pages
- 404 and global error pages
- Final responsive audit across all pages

**Deliverables:**
- Role management page (super_admin only)
- Settings page functional
- All edge cases handled with proper UI
- Empty states designed and implemented
- Lighthouse score > 85

**Files:**
```
src/app/(admin)/admin/users/page.tsx
src/app/(admin)/admin/settings/page.tsx
src/app/not-found.tsx
src/app/error.tsx
src/components/shared/EmptyState.tsx
src/components/shared/ErrorBoundary.tsx
src/components/shared/LoadingSpinner.tsx
src/actions/settings.ts
```

**Database Changes:** Read/write settings table. Update users role column.

**Testing:**
- Super admin can change user roles
- Settings update and persist
- Visiting non-existent page shows 404
- All list pages show empty state when no data

**Expected Result:** Production-ready, fully polished application.

---

### Phase 7 — Deployment & Documentation

**Goal:** Live production application with complete documentation.

**Features:**
- Vercel production deployment
- Production Supabase project configured
- All environment variables set in Vercel
- All documentation files completed
- Performance audit completed
- Code review and cleanup

**Deliverables:**
- Live URL accessible
- All docs/ files completed
- README.md with full setup instructions
- Lighthouse performance score > 85

**Files:**
```
docs/README.md (updated)
docs/SETUP.md (completed)
docs/DATABASE.md (completed)
docs/DEPLOYMENT.md (completed)
docs/CONTRIBUTING.md (completed)
docs/features/ (one file per feature)
```

**Testing:**
- Full manual walkthrough of all user roles
- All pages load correctly in production
- Auth flow works in production
- File uploads work in production

**Expected Result:** LCMS is live, documented, and ready for handover.

---

## 6. Roadmap Summary

| Phase | Focus | Estimated Effort |
|-------|-------|-----------------|
| 0 | Project Setup | 1–2 days |
| 1 | Database + Auth | 3–4 days |
| 2 | Public Website | 4–5 days |
| 3 | Member Portal | 3–4 days |
| 4 | Admin Core | 5–7 days |
| 5 | Admin Extended | 4–5 days |
| 6 | Roles + Polish | 3–4 days |
| 7 | Deploy + Docs | 2–3 days |

**Total estimated: 25–34 focused development days**
