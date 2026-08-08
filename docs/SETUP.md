# Setup Guide — LCMS

## Prerequisites

Before starting, make sure you have:

- Node.js 18+ installed — https://nodejs.org
- Git installed — https://git-scm.com
- A GitHub account — https://github.com
- A Supabase account — https://supabase.com
- A Vercel account — https://vercel.com
- Visual Studio Code — https://code.visualstudio.com

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_ORG/lcms.git
cd lcms
```

---

## Step 2 — Install Dependencies

```bash
npm install
```

---

## Step 3 — Create a Supabase Project

1. Go to https://supabase.com and log in
2. Click **New Project**
3. Name it `lcms-dev`
4. Choose a strong database password and save it
5. Select the closest region
6. Wait for the project to be created

---

## Step 4 — Configure Environment Variables

Copy the example file:

```bash
cp .env.example .env.local
```

Fill in your values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Find these values in:
**Supabase Dashboard → Project Settings → API**

> Never commit `.env.local` to GitHub. It is already in `.gitignore`.

---

## Step 5 — Apply Database Migrations

In the Supabase Dashboard, go to **SQL Editor** and run the migration files in order:

1. `supabase/migrations/001_create_tables.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/migrations/003_triggers.sql`
4. `supabase/seed.sql` (optional — loads sample data)

Alternatively, if you have the Supabase CLI installed:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

---

## Step 6 — Configure Supabase Auth

In Supabase Dashboard:

1. Go to **Authentication → Providers**
2. Make sure **Email** provider is enabled
3. Go to **Authentication → Email Templates** and customize if desired
4. Go to **Authentication → URL Configuration**
5. Set **Site URL** to `http://localhost:3000`
6. Add `http://localhost:3000/**` to **Redirect URLs**

---

## Step 7 — Configure Supabase Storage

In Supabase Dashboard:

1. Go to **Storage**
2. Create the following buckets:

| Bucket Name | Public |
|-------------|--------|
| `avatars` | Yes |
| `gallery` | Yes |
| `documents` | No |
| `covers` | Yes |

---

## Step 8 — Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Step 9 — Create the First Super Admin

1. Register a new account at http://localhost:3000/register
2. Verify your email
3. In Supabase Dashboard → **Table Editor → users**
4. Find your user row and change the `role` column to `super_admin`
5. Log in — you now have full admin access

---

## VS Code Extensions (Recommended)

Install these for the best development experience:

- ESLint
- Prettier — Code formatter
- Tailwind CSS IntelliSense
- TypeScript Next.js
- GitLens
- Prisma (if using Supabase CLI types)

---

## Environment Variables Reference

See `.env.example` for all required variables and descriptions.

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anon key (safe for browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service role key (server only, never expose) |

---

## Common Issues

**Problem:** `Error: Missing environment variable`
**Fix:** Make sure `.env.local` exists and all values are filled in.

**Problem:** Auth redirect not working
**Fix:** Check that your Site URL and Redirect URLs are set correctly in Supabase Auth settings.

**Problem:** RLS blocking queries
**Fix:** Check that you are logged in and the correct RLS policies are applied. Review `supabase/migrations/002_rls_policies.sql`.

**Problem:** Images not loading from Supabase Storage
**Fix:** Make sure the Storage bucket is set to **Public** and the file path is correct.
