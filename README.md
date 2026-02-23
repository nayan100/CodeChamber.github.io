# Portfolio + Admin Dashboard

A production-ready personal portfolio website with an admin panel, built with **Next.js 14 App Router**, **Supabase**, **Tailwind CSS**, and **Framer Motion**.

---

## Features

**Public Site**
- Hero → About → Experience → Projects → Leadership → Contact
- Project filtering by tag (IoT, Backend, AI, DevOps, Frontend) + search
- Smooth-scroll dark theme with light/dark toggle
- Contact form saved to database
- SEO metadata + Schema.org Person JSON-LD
- Resume PDF download

**Admin Panel** (`/admin`)
- Protected by NextAuth credentials (email + bcrypt password)
- CRUD for Projects, Experience, Skills, Blog Posts
- Dashboard analytics (counts at a glance)
- Toast notifications + form validation

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/CodeChamber.github.io.git
cd CodeChamber.github.io
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. In the **SQL Editor**, paste and run the entire [`supabase/schema.sql`](./supabase/schema.sql) file
3. Copy your project URL and keys from **Settings → API**

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<run: openssl rand -base64 32>

ADMIN_EMAIL=admin@yoursite.com
ADMIN_PASSWORD_HASH=<see below>
```

**Generate admin password hash:**
```bash
node -e "const b=require('bcryptjs'); b.hash('YourPassword123', 10, (_,h)=>console.log(h))"
```
Copy the output hash into `ADMIN_PASSWORD_HASH`.

### 4. Add Resume PDF

Place your resume file at:
```
public/resume.pdf
```

### 5. Customize Your Info

Update the seed data in `supabase/schema.sql` with your real name, email, LinkedIn, GitHub, and experience. Or use the Admin Panel after setup.

In `src/app/layout.tsx`, update the `metadata` object and JSON-LD with your real name and URLs.

### 6. Run Locally

```bash
npm run dev
```

Visit: `http://localhost:3000`  
Admin panel: `http://localhost:3000/admin/login`

---

## Deployment on Vercel

1. Push repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import repo
3. Set all environment variables in Vercel project settings (same as `.env.local` but with `NEXTAUTH_URL` = your production URL)
4. Deploy — Vercel auto-detects Next.js

> **GitHub Pages Note:** GitHub Pages only supports static files. This project uses API routes and server-side rendering, so **Vercel is the recommended host**. GitHub Pages can host the static `public/` assets but not the full Next.js app.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Public home page (all sections)
│   ├── layout.tsx                # Root layout + SEO
│   ├── globals.css               # Design system tokens
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   └── contact/              # Contact form endpoint
│   └── admin/
│       ├── login/                # Admin login page
│       ├── dashboard/            # Stats overview
│       ├── projects/             # Projects CRUD
│       ├── experience/           # Experience CRUD
│       ├── skills/               # Skills manager
│       └── blog/                 # Blog posts CRUD
├── components/
│   ├── public/                   # Hero, About, Experience, Projects, Leadership, Contact, Navbar
│   ├── admin/                    # AdminLayout, Sidebar
│   └── Providers.tsx             # NextAuth SessionProvider
├── lib/
│   ├── supabase/client.ts        # Browser Supabase client
│   ├── supabase/server.ts        # Server-side admin client
│   └── auth.ts                   # NextAuth config
├── types/index.ts                # Shared TypeScript types
└── middleware.ts                 # Route protection
supabase/
└── schema.sql                    # Full DB schema + seed data
```

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | NextAuth.js v4 (Credentials) |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Notifications | React Hot Toast |
| Icons | Lucide React |
| Hosting | Vercel |
