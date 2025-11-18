# Visit Tembaro – Improvement Plan

This document is the single source of truth for migrating the project to **PostgreSQL**, making it **production-ready and maintainable**, ensuring **all functionality works** (no dummy UI), and **containerizing** the stack so you can run everything with `docker compose up --build`.

---

## Plan review (checklist)

### ✅ Is it correct and does it keep the base system?

**Yes.** The plan keeps the existing product and structure:

- **Kept:** All current routes (`/`, `/about`, `/attractions`, `/attractions/[id]`, `/culture`, `/culture/[id]`, `/news`, `/news/[id]`, `/gallery`, `/plan-visit`, `/contact`, `/admin`), all pages and layouts, and all UI components (Navbar, Footer, Hero, shadcn, Tailwind, react-hook-form, Zod, Leaflet, etc.). No rewrite of the front-end app.
- **Changed:** Only the data and auth layer: Supabase (DB + Auth + Storage) is replaced by PostgreSQL + NextAuth + local (or volume) file storage. The same screens, forms, and flows remain; they call new API routes and auth instead of Supabase.

### ✅ Any remaining fixes and improvements that should be planned?

**Yes.** The following are now included in the plan so nothing is missed:

- **Schema/type consistency:** Use a single convention for field names (e.g. DB/API use `snake_case`; TypeScript types match). Fix existing bugs: `app/culture/[id]/page.tsx` uses `imageUrl` and imports from `@/lib/services/culture`; the service lives in `cultural.ts` and the type uses `image_url` — fix import path and property name (Phase 4).
- **Itineraries types:** `lib/services/itineraries.ts` uses `createdAt`/`updatedAt` in Omit types but DB uses `created_at`/`updated_at`; fix when replacing with API/DB layer (Phase 3).
- **Contact page typo:** "Centeral Ethiopia Region" → "Central Ethiopia Region" (Phase 4 or 6).
- **Placeholder images:** Clarification: "No dummy UI" means no non-functional buttons/links. Keeping a **fallback image** when `image_url` is missing (e.g. `/placeholder.svg`) is correct. Use one consistent fallback; fix `components/featured-attractions.tsx` which uses `'/placeholder.jpg'` (may 404) to use `/placeholder.svg` (Phase 4).
- **Next.config:** Remove or update `images.remotePatterns` for Supabase host after migration; document that uploads are same-origin (Phase 6).
- **Navbar:** Add "My Bookings" link that only shows when the user is logged in (Phase 4).
- **Public assets:** `public/landscape_files/` contains many unrelated downloaded files; add to `.dockerignore` and optionally remove from repo (Phase 6).
- **Admin UX:** Keep the current single-page admin: `/admin` shows login or dashboard based on session. No need for a separate `/admin/login` route unless you want it; middleware can redirect unauthenticated users to `/admin` (which then shows the login form).

### ✅ Is the plan ready to execute?

**Yes, after the updates below.** Execution readiness additions:

- **ORM choice:** Plan locks **Prisma** as the recommended option for Phase 1 so implementation does not block on "Prisma or Drizzle?".
- **NextAuth tables:** Phase 1.1 schema explicitly includes tables required by NextAuth (e.g. `Session`, `Account`) when using the Prisma adapter, or document that they are created by migration after adding NextAuth.
- **DB init in Docker:** Explicit step: app container runs `prisma migrate deploy` (or equivalent) before `next start`, or a separate init container runs schema once postgres is healthy.
- **API contracts:** GET `/api/bookings` returns only the authenticated user's bookings; POST body and response shapes are specified so frontend and backend match.
- **Pre-implementation checklist** is added at the end so you can confirm env, tools, and order before starting.

---

## Goals

| Goal | Description |
|------|-------------|
| **PostgreSQL only** | Remove Supabase entirely; use a single PostgreSQL database for all data and auth. |
| **Production & maintainable** | Strict TypeScript/ESLint, consistent patterns, clear layering, no build/lint bypasses. |
| **Working functionality** | Every button/link does something real; no placeholders or dead UI. |
| **Docker Compose** | One command: `docker compose up --build` runs app + DB (+ optional file storage). |

---

## Phase 1: Foundation (Database & API Layer)

### 1.1 Database: PostgreSQL schema and migrations

- **Add** a proper PostgreSQL schema that mirrors current entities and supports auth.

**Tables to create (aligned with `types/schema.ts`):**

- `users` – id (uuid), email (unique), password_hash, full_name, avatar_url, created_at, updated_at  
  - Used for admin login and for booking (optional: allow “guest” bookings later).
- `attractions` – id, name, description, short_description, image_url, location (jsonb or lat/lng/address), category, difficulty, duration, accessibility, highlights (text[] or jsonb), best_time, featured, price, created_at, updated_at  
- `news` – id, title, content, excerpt, image_url, category, author, publish_date, featured, created_at, updated_at  
- `gallery` – id, title, description, image_url, category, created_at, updated_at  
- `cultural_items` – id, title, description, image_url, category, is_featured, created_at, updated_at  
- `contact_messages` – id, name, email, subject, message, read, created_at  
- `itineraries` – id, title, description, duration, difficulty, highlights (array), created_at, updated_at  
- `bookings` – id, user_id (fk users), attraction_id (fk attractions), booking_date, booking_time, number_of_people, total_price, status, special_requests, created_at, updated_at  
- **NextAuth (Prisma adapter):** `Account`, `Session`, `VerificationToken` — add to schema in Phase 2; created by Prisma migration.

**Deliverables:**

- `prisma/schema.prisma` (recommended) defining all tables, indexes, and FKs.
- Migrations: use Prisma Migrate so Docker can run `prisma migrate deploy` before app start.
- **Seed (recommended):** `prisma/seed.ts` (or seed script) to create at least one admin user so login and full flow can be tested after first `docker compose up --build`.

### 1.2 Database access: ORM or query layer

- **Choice for execution:** **Prisma** (recommended for this plan). Use Prisma Client for all server-side DB access; Prisma Migrate for schema changes; NextAuth Prisma adapter in Phase 2.
- **Location:** `lib/db/prisma.ts` – singleton `PrismaClient` from `DATABASE_URL` (server-only).

**Deliverables:**

- `lib/db/prisma.ts` – instantiate PrismaClient, export singleton; ensure single instance in dev (e.g. `globalThis` guard).
- Types: use Prisma-generated types where possible; keep or align `types/schema.ts` with Prisma model names and field convention (snake_case in DB mapped to camelCase in Prisma if desired).

### 1.3 File storage (replace Supabase Storage)

- **Option A (simplest):** Local filesystem under a dedicated directory (e.g. `public/uploads/` or `/uploads` served by Next.js).
- **Option B:** MinIO (S3-compatible) in Docker for production-like object storage.

**Decision:** Start with **Option A** for “run with docker compose only”; store files in a **volume** so they persist. Serve via Next.js route (e.g. `/api/uploads/[...path]` or static `public/uploads`).

**Deliverables:**

- `lib/uploads.ts` – save file to disk, return URL path (e.g. `/uploads/attractions/xxx.jpg`).
- One API route for uploads (e.g. `POST /api/upload`) used by admin forms; validate file type/size.
- In Docker: mount a volume for the uploads directory.

---

## Phase 2: Authentication (Replace Supabase Auth)

### 2.1 Auth strategy

- **Approach:** Session-based auth with **NextAuth.js** (or similar) using:
  - **Credentials provider:** email + password; verify against `users.password_hash` in PostgreSQL (use bcrypt).
  - **Database adapter:** store sessions in PostgreSQL (e.g. NextAuth Prisma adapter with table `Session`).

**Deliverables:**

- Tables: `users` (above), `accounts` and `sessions` if using NextAuth adapter.
- `lib/auth.ts` – NextAuth config (Credentials + adapter), `getServerSession`, protect API routes and server components.
- `app/api/auth/[...nextauth]/route.ts` – NextAuth API route.
- Replace `AuthProvider` / `useAuth` to use NextAuth `SessionProvider` and `useSession`; keep the same UX (login form, logout, show user in admin).

### 2.2 Admin protection

- **Server-side:** In admin layout or page, call `getServerSession()`; if no session, show login (keep current single-page `/admin` that toggles between AdminLogin and AdminDashboard). Optionally add middleware to redirect unauthenticated users visiting `/admin` to the same `/admin` (no separate `/admin/login` required).
- **API routes:** For any admin-only API (CRUD for news, attractions, etc.), check session and return 401/403 if not authenticated.
- **Optional:** Add a `role` (e.g. `admin`) on `users` and enforce it in middleware or API.

**Deliverables:**

- `middleware.ts` – optional: protect `/admin` (e.g. allow access but let page handle login vs dashboard).
- Consistent `requireAuth()` or similar in API routes that mutate data or serve admin-only data.

---

## Phase 3: API Layer (Replace Supabase Client Calls)

### 3.1 API route design

- **Pattern:** Next.js **App Router API routes** under `app/api/`.
- **Public read:** e.g. `GET /api/attractions`, `GET /api/attractions/[id]`, `GET /api/news`, etc. – no auth.
- **Admin write:** e.g. `POST/PUT/DELETE /api/admin/attractions`, `/api/admin/news`, etc. – require auth.
- **Contact:** `POST /api/contact` – insert into `contact_messages` (no auth).
- **Bookings:**  
  - `POST /api/bookings` – require auth; body: `attraction_id`, `booking_date`, `booking_time`, `number_of_people`, `special_requests?`; compute `total_price` server-side from attraction price; return created booking.  
  - `GET /api/bookings` – require auth; return only the current user's bookings (with attraction details for listing).  
  - `PATCH /api/bookings/[id]` – require auth; allow cancel (status → `cancelled`); ensure booking belongs to user.

**Deliverables:**

- `app/api/attractions/route.ts` (list), `app/api/attractions/[id]/route.ts` (get one).
- `app/api/admin/attractions/route.ts` (create), `app/api/admin/attractions/[id]/route.ts` (update, delete).
- Same pattern for: news, gallery, cultural, contact, itineraries, bookings.
- `app/api/auth/[...nextauth]/route.ts` (Phase 2).
- All handlers use the DB layer from Phase 1; return proper status codes and JSON; validate input (e.g. Zod).

### 3.2 Remove Supabase and switch frontend to API

- **Delete:**  
  - `lib/supabase.ts`, `lib/supabase/client.ts`, `lib/supabase/server.ts`, `app/lib/supabase/server.ts`.
- **Replace:**  
  - Every `lib/services/*` module: instead of calling Supabase, call `fetch('/api/...')` (from client) or call DB directly from server components/API routes.
- **Server components:** Can keep calling a server-side service that uses the DB client (no fetch to self).  
- **Client components (e.g. admin dashboard):** Use `fetch` to `POST/GET /api/admin/...` and `/api/...`.
- **Remove from package.json:** `@supabase/ssr`, `@supabase/supabase-js`, `firebase`.

**Deliverables:**

- New `lib/services/*` (or `lib/api/*`) that either:
  - Use DB client directly (server-only), or  
  - Call internal API (e.g. from client).
- No remaining Supabase or Firebase imports; build passes.

---

## Phase 4: Application Fixes (Working Features & No Dummy UI)

### 4.1 Bookings flow

- **Add** `app/bookings/page.tsx`: list the current user’s bookings (call `GET /api/bookings` with session; show attraction name, date, time, status, cancel button).
- **Booking form:** Already redirects to `/bookings`; ensure `POST /api/bookings` creates a row and returns success; fix any payload (e.g. do not send `updated_at` if not in API contract).
- **Optional:** `GET /api/bookings/[id]` and cancel → `PATCH /api/bookings/[id]` (status: cancelled).

**Deliverables:**

- `/bookings` page implemented and linked from navbar (e.g. “My Bookings” when logged in).
- Create booking → redirect to `/bookings` with success toast; list and cancel work.

### 4.2 Dummy buttons and non-functional UI

Audit and fix every button/link so it has a real action or navigates somewhere real:

| Location | Current | Action |
|----------|---------|--------|
| `app/attractions/page.tsx` | “Plan Your Visit” (no href) | Wrap in `<Link href="/plan-visit">`. |
| `app/attractions/page.tsx` | “Contact Guide” (no href) | Wrap in `<Link href="/contact">`. |
| `app/attractions/[id]/page.tsx` | “View Gallery” button | Link to `/gallery` or `/gallery?attraction=:id` (or remove if no gallery filter). |
| `app/attractions/[id]/page.tsx` | “Share” button | Implement share (e.g. `navigator.share` or copy link to clipboard). |
| `app/attractions/attractions-list.tsx` | Filter buttons “Natural” / “Cultural” | Keep; ensure categories in DB match. |
| `app/culture/page.tsx` | “Book Cultural Tour” / “View Festival Calendar” | Link to `/plan-visit` or a dedicated section; or to contact with pre-filled subject. |
| `app/culture/[id]/page.tsx` | Share / other ghost buttons | Implement or remove. |
| `app/news/[id]/page.tsx` | Share buttons | Implement or remove. |
| `app/culture/festivals-list.tsx` | Generic “Learn more” | Link to relevant culture item or plan-visit. |
| `app/plan-visit/page.tsx` | Any CTAs | Ensure they link to contact or bookings. |
| `components/hero.tsx` | Already has links | No change. |

**Placeholder images (clarification):** "No dummy UI" means no non-functional buttons/links. Using a **fallback image** when `image_url` is missing (e.g. `/placeholder.svg`) is correct. Use one consistent fallback across the app; fix `components/featured-attractions.tsx` (uses `'/placeholder.jpg'`, may 404) to use `/placeholder.svg`.

**Existing bugs to fix in Phase 4 (or when touching these files):**
- `app/culture/[id]/page.tsx`: import from `@/lib/services/cultural` (not `culture`); use `culturalItem.image_url` and `relatedItem.image_url` (not `imageUrl`) to match schema.
- **Navbar:** Add "My Bookings" link visible only when user is logged in; link to `/bookings`.
- **Contact page:** Fix typo "Centeral Ethiopia Region" → "Central Ethiopia Region".

**Deliverables:**

- No standalone button that does nothing; every primary/secondary button either navigates or triggers a clear action (submit, share, open modal, etc.).
- Consistent image fallback; culture [id] page import and property names fixed; contact typo fixed; Navbar shows My Bookings when authenticated.

### 4.3 Toast and form feedback

- **Standardize on one toast system:** e.g. **Sonner** everywhere (simplest) or shadcn `useToast` everywhere.
- **Remove** the other; update all `toast(...)` and `<Toaster />` usage so success/error messages appear consistently (contact, booking, admin forms).

**Deliverables:**

- Single toast provider in root layout; all forms and actions use it; no duplicate Toaster components.

### 4.4 Build and code quality

- **next.config.mjs:** Remove `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` (set to `false` or delete).
- **Fix** all TypeScript and ESLint errors so `pnpm build` and `pnpm lint` pass.
- **Environment:** Use a single `.env.example` with `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and any upload path; no Supabase vars.

**Deliverables:**

- `pnpm build` and `pnpm lint` pass; `.env.example` documented; no dummy env values in repo.

---

## Phase 5: Docker & Docker Compose

### 5.1 Services

- **postgres:**  
  - Image: `postgres:16-alpine` (or 15).  
  - Environment: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`.  
  - Volume for data persistence.  
  - Healthcheck: `pg_isready`.  
  - Port: expose only if needed for local tools (e.g. 5432).

- **app (Next.js):**  
  - Build: `Dockerfile` in project root (or `./app`).  
  - Run: `next start` (production).  
  - Env: `DATABASE_URL=postgresql://...` (user, password, db, host=postgres), `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, upload dir.  
  - Depends on postgres (and optional minio).  
  - Port: 3000.  
  - Volume for uploads (if using filesystem storage): e.g. `./uploads:/app/uploads` or named volume.

- **DB init:** Run migrations before app start so the schema exists. Options: (1) App container entrypoint runs `npx prisma migrate deploy` then `next start`, or (2) a one-off init container runs after postgres is healthy. Recommended: entrypoint in app Dockerfile.

### 5.2 Dockerfile (Next.js)

- Multi-stage: deps install → build → production stage with `next start`.
- Use Node 20 LTS.
- Do not run as root in production stage if possible.
- Create non-root user and set ownership for uploads directory if app writes there.

**Deliverables:**

- `Dockerfile` at repo root (or in `./app`).
- `docker-compose.yml` with services: `postgres`, `app`; env and volumes as above.
- `.dockerignore` (exclude `node_modules`, `.next`, `.git`, etc.).

### 5.3 One-command run

- Ensure: `docker compose up --build` starts Postgres and the app; app can connect to DB and run migrations (or init script); visiting `http://localhost:3000` shows the site; admin login and one full flow (e.g. create attraction, create booking) work.

**Deliverables:**

- `README.md` section: “Run with Docker: `docker compose up --build`” and required env (copy from `.env.example` or document in README).
- Optional: `docker compose.override.example.yml` or env example for local overrides.

---

## Phase 6: Cleanup & Consistency

### 6.1 Naming and project identity

- **package.json:** Change `"name"` from `"my-v0-project"` to e.g. `"visit-tembaro"`.
- **Metadata:** In `app/layout.tsx`, set `metadataBase` to production URL (or env); remove `generator: 'v0.dev'` if desired.

### 6.2 Admin and security

- Remove **demo credentials** from admin login UI (or show only in development via env).
- Ensure **passwords** are hashed (bcrypt) and never logged; **NEXTAUTH_SECRET** is required and strong in production.

### 6.3 Code structure

- **Single source of types:** Prefer types from Prisma or a single `types/schema.ts` that matches DB; avoid duplicate definitions. Use one naming convention (e.g. snake_case in DB, camelCase in Prisma/API if desired).
- **Error handling:** API routes return consistent shape (e.g. `{ error?: string }`); frontend shows toast or inline error.
- **Validation:** All API inputs validated with Zod (or similar); reuse schemas between frontend forms and API.

### 6.4 Remaining cleanup

- **next.config.mjs:** Remove or update `images.remotePatterns` for Supabase host; uploads will be same-origin (`/uploads/...` or `public/uploads`).
- **public/landscape_files/:** Add `public/landscape_files` to `.dockerignore`; optionally remove this folder from the repo (unrelated downloaded assets).
- **Itineraries:** When replacing Supabase in Phase 3, fix type names: use `created_at`/`updated_at` in types and API (not `createdAt`/`updatedAt`).

---

## Implementation Order (Suggested)

1. **Phase 1.1–1.2** – PostgreSQL schema + DB client (Prisma/Drizzle/pg).  
2. **Phase 1.3** – File upload/storage (local volume).  
3. **Phase 2** – NextAuth + Credentials + DB adapter; replace AuthProvider.  
4. **Phase 3** – API routes for all entities; replace Supabase in services and remove Supabase packages.  
5. **Phase 4** – Bookings page, dummy UI fixes, toast consolidation, build/lint.  
6. **Phase 5** – Dockerfile + docker-compose; test full flow.  
7. **Phase 6** – Naming, metadata, security, and consistency.

---

## File Change Summary

| Action | Paths |
|--------|--------|
| **Add** | `prisma/schema.prisma`, `prisma/seed.ts`, `lib/db/prisma.ts`, `lib/uploads.ts`, `lib/auth.ts`, `app/api/auth/[...nextauth]/route.ts`, `app/api/attractions/*`, `app/api/attractions/[id]/*`, `app/api/admin/*` (per entity), `app/api/contact`, `app/api/bookings`, `app/api/upload`, `app/bookings/page.tsx`, `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `.env.example` |
| **Replace** | `lib/services/*` (use DB or fetch to API), `components/auth-provider.tsx` (NextAuth SessionProvider + useSession), admin dashboard (fetch to /api/admin/*), forms (submit to API + upload endpoint) |
| **Remove** | `lib/supabase.ts`, `lib/supabase/client.ts`, `lib/supabase/server.ts`, `app/lib/supabase/server.ts`; Supabase and Firebase from package.json |
| **Edit** | `next.config.mjs` (enable lint/TS), `app/layout.tsx` (metadataBase, Toaster), all pages with dummy buttons (links or real actions), `components/booking/booking-form.tsx` (API + redirect), `package.json` (name, deps) |

---

## Definition of Done

- [ ] No Supabase or Firebase; all data and auth use PostgreSQL.
- [ ] `docker compose up --build` starts Postgres and the app; app is reachable and uses the DB.
- [ ] Admin login (email/password), dashboard CRUD for attractions, news, gallery, culture, messages work end-to-end.
- [ ] Contact form submits and stores in DB; bookings can be created (logged-in user) and listed on `/bookings`.
- [ ] No dummy buttons; every button/link has a defined behavior.
- [ ] Single toast system; build and lint pass; env documented in `.env.example` and README.

This plan is the reference for implementing the migration and production readiness. Each phase can be broken into smaller tasks and tracked in your project board or issues.

---

## Pre-implementation checklist (ready to execute)

Before starting Phase 1, confirm:

- [ ] **Environment:** Node 20 LTS and pnpm (or npm) available locally; Docker and Docker Compose installed.
- [ ] **Repo state:** Clean working tree or a dedicated branch for the migration; no uncommitted Supabase-specific secrets in `.env`.
- [ ] **Decisions locked:** ORM = Prisma; auth = NextAuth (Credentials + Prisma adapter); file storage = local directory with Docker volume; single-page admin at `/admin`.
- [ ] **Order:** Phase 1.1 (Prisma schema + migrate) → 1.2 (Prisma client) → 1.3 (uploads) → Phase 2 (NextAuth) → Phase 3 (API routes + remove Supabase) → Phase 4 (bookings page, dummy UI, toasts, lint/TS) → Phase 5 (Dockerfile + Compose) → Phase 6 (naming, metadata, security, cleanup).
- [ ] **First run after Docker:** Seed at least one admin user (e.g. via Prisma seed or a one-time script) so you can log in and test admin CRUD and bookings.
