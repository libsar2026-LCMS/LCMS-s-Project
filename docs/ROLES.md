# LCMS — Roles & Responsibilities
# LIBSAR Community Management System
# ============================================================
# This file defines every role in the system, their access
# level, permissions, and responsibilities.
# ============================================================

## Role Hierarchy (highest → lowest)

  super_admin
      │
  president
      │
  secretary
      │
  committee_head
      │
  member
      │
  visitor


---

## 1. super_admin

### Who holds this role
The system owner / technical administrator of LCMS. Typically the ICT Committee lead
or the person responsible for maintaining the platform.

### Access
- Full unrestricted access to every part of the system
- The only role that can access the Users & Roles page (/admin/users)
- The only role that can modify system Settings (/admin/settings)

### Responsibilities
- Create, update, and delete any user account
- Assign and change roles for all users
- Manage system-wide settings (site name, contact info, social links, founded year)
- Full CRUD on all content: members, events, news, gallery, documents, leadership, committees
- Send notifications to any member
- Read and manage all contact messages
- Manage storage (profile photos, documents)
- Promote or demote any user to any role
- Suspend or deactivate member accounts

### Database permissions (RLS)
- SELECT / INSERT / UPDATE / DELETE on ALL tables
- Exclusive: public.users (role management), public.settings


---

## 2. president

### Who holds this role
The elected President of LIBSAR for the current academic year.

### Access
- Full access to the Admin Dashboard (/admin/*)
- Cannot access Users & Roles page (/admin/users) — super_admin only
- Cannot modify system Settings — super_admin only

### Responsibilities
- Oversee all community content published on the platform
- Create, edit, publish, and delete events
- Create, edit, publish, and delete news articles
- Manage gallery albums and photos
- Upload and manage documents
- Manage leadership records (add/edit/remove board members)
- Manage committees (create, update, deactivate)
- View and manage all member profiles
- Read and respond to contact messages
- Send notifications to members
- Mark contact messages as read

### Database permissions (RLS)
- SELECT / INSERT / UPDATE / DELETE on:
  profiles, committees, leadership, events, event_registrations,
  news, gallery_albums, gallery_photos, documents, notifications,
  contact_messages


---

## 3. secretary

### Who holds this role
The elected Secretary of LIBSAR for the current academic year.

### Access
- Full access to the Admin Dashboard (/admin/*)
- Cannot access Users & Roles page (/admin/users) — super_admin only
- Cannot modify system Settings — super_admin only

### Responsibilities
- Same content management responsibilities as president
- Maintain accurate member records (profiles, membership status)
- Record and publish meeting minutes as documents
- Manage event registrations and attendance tracking
- Publish news announcements and community updates
- Manage gallery albums for events
- Handle contact messages from the public
- Send notifications to members

### Database permissions (RLS)
- Identical to president:
  SELECT / INSERT / UPDATE / DELETE on:
  profiles, committees, leadership, events, event_registrations,
  news, gallery_albums, gallery_photos, documents, notifications,
  contact_messages


---

## 4. committee_head

### Who holds this role
The elected or appointed head of any LIBSAR committee
(e.g. Academic, Sports, Cultural, Welfare, ICT).

### Access
- Member Portal only (/dashboard, /profile, /my-events, /notifications, /membership-card)
- No access to Admin Dashboard
- Identified in the committees table via head_id FK
- Displayed publicly on the Committees page as committee head

### Responsibilities
- All standard member responsibilities (see below)
- Represent their committee in community activities
- Coordinate with secretary/president on committee events
- Their name and photo appear on the public Committees page

### Database permissions (RLS)
- Same as member (no elevated DB permissions beyond member level)
- Distinction is display/organisational only at this stage


---

## 5. member

### Who holds this role
Any registered and verified Liberian student or resident in Rwanda
who has completed the registration process.

### Access
- Member Portal (/dashboard, /profile, /my-events, /notifications, /membership-card)
- All public pages (/about, /events, /news, /gallery, /documents, /leadership, /committees, /contact)
- No access to Admin Dashboard

### Responsibilities
- Keep personal profile up to date (name, phone, university, department, academic level)
- Upload and maintain profile photo
- Register for community events
- View and download community documents
- Stay informed via notifications
- Submit contact messages
- Present digital membership card at events

### Database permissions (RLS)
- SELECT own profile (profiles WHERE id = auth.uid())
- UPDATE own profile
- SELECT published events
- INSERT own event registrations
- DELETE own event registrations
- SELECT own event registrations
- SELECT own notifications
- UPDATE own notifications (mark as read)
- SELECT published news
- SELECT published gallery albums and photos
- SELECT public documents
- SELECT all documents (authenticated)
- INSERT contact messages
- SELECT own user role (users WHERE id = auth.uid())


---

## 6. visitor

### Who holds this role
Any unauthenticated user browsing the public website.
No account required.

### Access
- Public pages only:
  / (home), /about, /events, /events/[slug], /news, /news/[slug],
  /gallery, /documents, /leadership, /committees, /contact
- /login, /register, /forgot-password pages
- Cannot access Member Portal or Admin Dashboard
- Redirected to /login if they attempt to access protected routes

### Responsibilities
- Browse public community information
- View published events, news, gallery, and documents
- Submit contact messages
- Register for a member account via /register

### Database permissions (RLS)
- SELECT published events (status = 'published')
- SELECT published news (status = 'published')
- SELECT published gallery albums (is_published = true)
- SELECT published gallery photos (in published albums)
- SELECT public documents (is_public = true)
- SELECT active committees (is_active = true)
- SELECT all leadership records
- SELECT settings (read-only)
- INSERT contact messages
- No access to profiles, users, notifications, event_registrations


---

## Access Matrix

| Feature / Page                  | visitor | member | committee_head | secretary | president | super_admin |
|---------------------------------|:-------:|:------:|:--------------:|:---------:|:---------:|:-----------:|
| Public website                  |   ✅    |   ✅   |       ✅       |    ✅     |    ✅     |     ✅      |
| Register / Login                |   ✅    |   ✅   |       ✅       |    ✅     |    ✅     |     ✅      |
| Member Portal                   |   ❌    |   ✅   |       ✅       |    ✅     |    ✅     |     ✅      |
| View own profile                |   ❌    |   ✅   |       ✅       |    ✅     |    ✅     |     ✅      |
| Edit own profile                |   ❌    |   ✅   |       ✅       |    ✅     |    ✅     |     ✅      |
| Upload profile photo            |   ❌    |   ✅   |       ✅       |    ✅     |    ✅     |     ✅      |
| Register for events             |   ❌    |   ✅   |       ✅       |    ✅     |    ✅     |     ✅      |
| View membership card            |   ❌    |   ✅   |       ✅       |    ✅     |    ✅     |     ✅      |
| View notifications              |   ❌    |   ✅   |       ✅       |    ✅     |    ✅     |     ✅      |
| Download all documents          |   ❌    |   ✅   |       ✅       |    ✅     |    ✅     |     ✅      |
| Admin Dashboard                 |   ❌    |   ❌   |       ❌       |    ✅     |    ✅     |     ✅      |
| Manage members                  |   ❌    |   ❌   |       ❌       |    ✅     |    ✅     |     ✅      |
| Manage events                   |   ❌    |   ❌   |       ❌       |    ✅     |    ✅     |     ✅      |
| Manage news                     |   ❌    |   ❌   |       ❌       |    ✅     |    ✅     |     ✅      |
| Manage gallery                  |   ❌    |   ❌   |       ❌       |    ✅     |    ✅     |     ✅      |
| Manage documents                |   ❌    |   ❌   |       ❌       |    ✅     |    ✅     |     ✅      |
| Manage leadership               |   ❌    |   ❌   |       ❌       |    ✅     |    ✅     |     ✅      |
| Manage committees               |   ❌    |   ❌   |       ❌       |    ✅     |    ✅     |     ✅      |
| Send notifications              |   ❌    |   ❌   |       ❌       |    ✅     |    ✅     |     ✅      |
| Read contact messages           |   ❌    |   ❌   |       ❌       |    ✅     |    ✅     |     ✅      |
| Manage system settings          |   ❌    |   ❌   |       ❌       |    ❌     |    ❌     |     ✅      |
| Manage user roles               |   ❌    |   ❌   |       ❌       |    ❌     |    ❌     |     ✅      |


---

## How to Assign Roles

Roles are stored in the `public.users` table under the `role` column.
Only a `super_admin` can change roles. Run in Supabase SQL Editor:

```sql
-- Promote a user to president
UPDATE public.users SET role = 'president' WHERE id = '<user-uuid>';

-- Promote a user to secretary
UPDATE public.users SET role = 'secretary' WHERE id = '<user-uuid>';

-- Assign committee head
UPDATE public.users SET role = 'committee_head' WHERE id = '<user-uuid>';

-- Demote back to member
UPDATE public.users SET role = 'member' WHERE id = '<user-uuid>';

-- Grant super_admin (use with caution)
UPDATE public.users SET role = 'super_admin' WHERE id = '<user-uuid>';
```

To find a user's UUID:
```sql
SELECT u.id, p.full_name, u.role
FROM public.users u
JOIN public.profiles p ON p.id = u.id
ORDER BY u.created_at DESC;
```


---

## Default Role on Registration

Every new user who registers via /register is automatically assigned
the `member` role by the `handle_new_user` trigger in 003_triggers.sql.

A `super_admin` must manually elevate any user to a higher role.
