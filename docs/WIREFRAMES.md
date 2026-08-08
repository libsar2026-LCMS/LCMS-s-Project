# Wireframe Recommendations — LCMS

This document describes the layout and structure of key pages.
These are text-based wireframe descriptions to guide UI implementation.
Build these pages in the order they appear in the development phases.

---

## Public Pages

---

### Home Page

```
┌─────────────────────────────────────────────────────┐
│  NAVBAR: Logo | Nav Links | Login Button            │
├─────────────────────────────────────────────────────┤
│  HERO SECTION                                       │
│  "Welcome to LIBSAR"                                │
│  Subtitle text                                      │
│  [Join Us Button]  [Learn More Button]              │
│  Background: navy gradient or community photo       │
├─────────────────────────────────────────────────────┤
│  STATS BAR                                         │
│  [Members]   [Events]   [Committees]   [Years]     │
├─────────────────────────────────────────────────────┤
│  ABOUT SECTION (brief, 2-column)                   │
│  Text on left | Image on right                     │
├─────────────────────────────────────────────────────┤
│  UPCOMING EVENTS (3 cards, horizontal)             │
│  [Event Card] [Event Card] [Event Card]            │
│  [View All Events →]                               │
├─────────────────────────────────────────────────────┤
│  LATEST NEWS (3 cards, horizontal)                 │
│  [News Card] [News Card] [News Card]               │
│  [View All News →]                                 │
├─────────────────────────────────────────────────────┤
│  LEADERSHIP PREVIEW (3–4 cards)                    │
├─────────────────────────────────────────────────────┤
│  CALL TO ACTION BANNER                             │
│  "Become a Member" [Register Button]               │
├─────────────────────────────────────────────────────┤
│  FOOTER                                            │
│  Logo | Links | Social Media | Contact Info        │
└─────────────────────────────────────────────────────┘
```

---

### Events Page

```
┌─────────────────────────────────────────────────────┐
│  NAVBAR                                             │
├─────────────────────────────────────────────────────┤
│  PAGE HEADER: "Events"                             │
├─────────────────────────────────────────────────────┤
│  FILTER BAR: [Type dropdown] [Search input]        │
├─────────────────────────────────────────────────────┤
│  SECTION: Upcoming Events                          │
│  [Card] [Card] [Card]                              │
│  [Card] [Card] [Card]                              │
├─────────────────────────────────────────────────────┤
│  SECTION: Past Events                              │
│  [Card] [Card] [Card]                              │
├─────────────────────────────────────────────────────┤
│  FOOTER                                            │
└─────────────────────────────────────────────────────┘
```

---

### Event Detail Page

```
┌─────────────────────────────────────────────────────┐
│  NAVBAR                                             │
├─────────────────────────────────────────────────────┤
│  COVER IMAGE (full width)                          │
├─────────────────────────────────────────────────────┤
│  TITLE                                             │
│  Date | Location | Type badge                      │
├───────────────────────────┬─────────────────────────┤
│  DESCRIPTION              │  EVENT DETAILS CARD     │
│  (rich text)              │  Date & Time            │
│                           │  Location               │
│                           │  Spots remaining        │
│                           │  [Register Button]      │
└───────────────────────────┴─────────────────────────┘
```

---

### News Page

```
┌─────────────────────────────────────────────────────┐
│  NAVBAR                                             │
├─────────────────────────────────────────────────────┤
│  PAGE HEADER: "News & Announcements"               │
├─────────────────────────────────────────────────────┤
│  FILTER: [All] [Announcements] [Scholarships] ...  │
├─────────────────────────────────────────────────────┤
│  [Large featured article — first news item]        │
├─────────────────────────────────────────────────────┤
│  [Card] [Card] [Card]                              │
│  [Card] [Card] [Card]                              │
├─────────────────────────────────────────────────────┤
│  PAGINATION                                        │
└─────────────────────────────────────────────────────┘
```

---

### Gallery Page

```
┌─────────────────────────────────────────────────────┐
│  NAVBAR                                             │
├─────────────────────────────────────────────────────┤
│  PAGE HEADER: "Gallery"                            │
├─────────────────────────────────────────────────────┤
│  ALBUMS GRID                                       │
│  [Album Cover + Title] [Album Cover + Title]       │
│  [Album Cover + Title] [Album Cover + Title]       │
├─────────────────────────────────────────────────────┤
│  (Clicking album opens photo grid for that album)  │
└─────────────────────────────────────────────────────┘
```

---

## Member Portal Pages

---

### Portal Dashboard

```
┌──────────────┬──────────────────────────────────────┐
│  SIDEBAR     │  WELCOME HEADER                      │
│              │  "Welcome back, [Name]"               │
│  Dashboard   ├──────────────────────────────────────┤
│  My Profile  │  STATS ROW                           │
│  Member Card │  [Events Registered] [Notifications] │
│  My Events   ├──────────────────────────────────────┤
│  Notifs      │  UPCOMING EVENTS (compact list)      │
│              ├──────────────────────────────────────┤
│  [Logout]    │  RECENT ANNOUNCEMENTS                │
│              │  (latest 3 news items)               │
└──────────────┴──────────────────────────────────────┘
```

---

### Membership Card Page

```
┌──────────────┬──────────────────────────────────────┐
│  SIDEBAR     │  PAGE HEADER: "My Membership Card"   │
│              ├──────────────────────────────────────┤
│              │  CARD PREVIEW                        │
│              │  ┌────────────────────────────────┐  │
│              │  │ [LIBSAR Logo]     [Photo]       │  │
│              │  │ Full Name                       │  │
│              │  │ Membership ID                   │  │
│              │  │ University | Department         │  │
│              │  │ Status: Active                  │  │
│              │  │ Member since: 2024              │  │
│              │  └────────────────────────────────┘  │
│              │                                      │
│              │  [Download Card Button]              │
└──────────────┴──────────────────────────────────────┘
```

---

## Admin Pages

---

### Admin Dashboard

```
┌──────────────┬──────────────────────────────────────┐
│  SIDEBAR     │  HEADER: "Dashboard"                 │
│              ├──────────────────────────────────────┤
│  Dashboard   │  STATS CARDS ROW                     │
│  Members     │  [Total Members] [Active] [Events]   │
│  Leadership  ├──────────────────────────────────────┤
│  Committees  │  CHARTS ROW                          │
│  Events      │  [Members by University Bar Chart]   │
│  News        │  [Members by Status Pie Chart]       │
│  Gallery     ├──────────────────────────────────────┤
│  Documents   │  RECENT MEMBERS TABLE (last 5)       │
│  ──────────  ├──────────────────────────────────────┤
│  Users       │  UPCOMING EVENTS LIST (next 3)       │
│  Settings    │                                      │
└──────────────┴──────────────────────────────────────┘
```

---

### Members Management Page

```
┌──────────────┬──────────────────────────────────────┐
│  SIDEBAR     │  HEADER: "Members"  [+ Add Member]  │
│              ├──────────────────────────────────────┤
│              │  SEARCH & FILTER BAR                 │
│              │  [Search by name...] [University ▼]  │
│              │  [County ▼] [Status ▼] [Committee ▼] │
│              ├──────────────────────────────────────┤
│              │  DATA TABLE                          │
│              │  Photo | Name | University | Status  │
│              │  County | Committee | Actions        │
│              │  ─────────────────────────────────── │
│              │  [Row] [Row] [Row] [Row] [Row]       │
│              ├──────────────────────────────────────┤
│              │  PAGINATION: < 1 2 3 ... >           │
└──────────────┴──────────────────────────────────────┘
```

---

## UI Notes

- Use shadcn/ui `Card`, `Button`, `Badge`, `Dialog`, `Sheet`, `Table` components
- All forms use shadcn/ui `Form`, `Input`, `Select`, `Textarea`
- Badges for status (Active = green, Inactive = gray, Suspended = red, Alumni = blue)
- Confirm destructive actions with a `Dialog` before executing
- Show `EmptyState` component with a helpful message when lists are empty
- Show `LoadingSpinner` during all async operations
