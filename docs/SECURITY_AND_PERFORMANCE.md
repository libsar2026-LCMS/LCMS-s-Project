# Security & Performance — LCMS

## Security Best Practices

### Authentication & Authorization
- Row-Level Security (RLS) enabled on every Supabase table
- Route protection enforced in `src/middleware.ts` before pages render
- Role is fetched server-side — never trust client-supplied role values
- Service role key used only in server-side code, never exposed to browser

### Environment Variables
- All secrets stored in environment variables
- `.env.local` is gitignored — never committed to GitHub
- `.env.example` documents required variables without real values
- Vercel environment variables set per-environment (production vs preview)

### Input Validation
- Zod schemas validate all form data on the client (immediate feedback)
- Same Zod schemas re-validate in Server Actions (cannot be bypassed)
- File uploads validated for type and size before upload to Supabase Storage

### File Uploads
- Allowed types: images (jpg, png, webp) for photos; pdf for documents
- Maximum file size: 5MB for images, 20MB for documents
- Files stored in Supabase Storage, not in the repository

### Rate Limiting
- Contact form: limit submissions per IP (Supabase Edge Function or middleware)
- Auth endpoints: Supabase handles rate limiting on login/register automatically

### General
- HTTPS enforced in production (Vercel default)
- No sensitive data in URL query parameters
- Regular dependency audits: `npm audit`
- Content Security Policy headers configured in `next.config.ts`

---

## Performance Optimization

### Images
- Use Next.js `<Image>` component for all images (automatic WebP conversion, lazy loading)
- Store images in Supabase Storage with appropriate CDN caching
- Compress images before upload

### Data Fetching
- Public event and news pages use static generation with `generateStaticParams`
- Revalidation set appropriately — public pages revalidate every 60 seconds
- Never fetch all records — always paginate large lists
- Use Supabase select with only needed columns (avoid `SELECT *` in production)

### Client vs Server
- Default to Server Components — they do not ship JavaScript to the browser
- Add `"use client"` only when the component needs interactivity
- Lazy load heavy components (e.g., rich text editor) with `next/dynamic`

### Caching
- Static public pages cached at CDN level by Vercel
- Dynamic portal and admin pages rendered on demand

---

## Backup Strategy

| Data | Method | Frequency |
|------|--------|-----------|
| Database | Supabase automatic backups (Pro) or manual export | Daily |
| Storage files | Manual export from Supabase dashboard | Monthly |
| Code | GitHub (always up to date) | On every push |

### Manual Database Export
In Supabase Dashboard → **Settings → Database → Backups**
Or via CLI: `supabase db dump > backup_$(date +%Y%m%d).sql`

---

## Maintenance Guide

### Keeping Dependencies Updated
```bash
npm outdated          # See what is outdated
npm update            # Update minor versions
npm audit             # Check for security vulnerabilities
npm audit fix         # Auto-fix vulnerabilities where possible
```

Review major version upgrades carefully before applying.

### Adding a New Admin User
1. Ask the user to register at `/register`
2. Go to Supabase Dashboard → **Table Editor → users**
3. Find their row and update the `role` column to the desired role

### Updating Site Settings
- Settings are stored in the `settings` table as key-value JSON pairs
- Update them via the Admin Dashboard → Settings page

### Database Schema Changes
1. Write a new migration file in `supabase/migrations/`
2. Name it sequentially: `004_your_change_description.sql`
3. Apply it via Supabase SQL Editor or CLI
4. Update `docs/DATABASE.md`

### Monitoring Production
- **Vercel Dashboard** → check deployment status and function logs
- **Supabase Dashboard** → monitor database size, auth events, storage usage
- Set up email alerts in Supabase for database errors

---

## Future Improvements (LCMS only)

These are planned improvements for future LIBSAR ICT teams to implement.

| Improvement | Priority | Notes |
|-------------|----------|-------|
| QR code on membership card | Medium | Use `qrcode.react` library |
| Event attendance QR scanning | Low | Admin scans member QR at event |
| Bulk member import via CSV | Medium | Admin utility for onboarding |
| Member dues tracking | Medium | Simple ledger, no payments gateway needed |
| Push notifications | Low | Supabase Realtime for real-time alerts |
| Annual report PDF generation | Low | Generate PDF from data |
| Alumni directory | Medium | Extend membership_status = 'alumni' |
| Mobile app | Low | React Native using the same Supabase backend |

> Do not build these until the core system is stable and in production.
