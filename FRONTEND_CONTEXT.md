# WEXON UI (Frontend) — Project Context

Last updated: 2026-03-14

## What this is

`wexon-ui/` is a Next.js (App Router) frontend for WEXON (Warehouse EXcellence & Optimization Network), an inventory/warehouse management system.

## Tech stack

- Next.js (currently `next@16.x`) + React (`react@19`)
- TypeScript
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- Data fetching/caching: TanStack Query
- Global state: Zustand (`src/store/userStore.ts`)
- HTTP client: Axios (`src/api/getAxiosInstance.ts`)
- Forms: JSONForms (`@jsonforms/*`) with JSON schema assets under `src/assets/schema/**`
- UI libs used in components: Radix-based primitives, `lucide-react`, `sonner` toasts

## Key runtime behavior

### Routing + auth

- Public routes: `/login`, `/register`, `/forgot-password`
- Protected routes are enforced in two places:
  - **Edge middleware**: `wexon-ui/src/middleware.ts` checks a `token` cookie and redirects to `/login` if missing.
  - **Client guard**: `wexon-ui/src/components/guards/AuthGuard.tsx` fetches the current user when `token` exists, stores it in Zustand, and redirects to `/login` on error.
- Public pages are wrapped with `PublicGuard` (`wexon-ui/src/components/guards/PublicGuard.tsx`) which redirects authenticated users to `/dashboard`.

### Token storage

- Token is stored in a **cookie named `token`** (see `wexon-ui/src/helpers/tokenCookie.ts`).
- On login success (`wexon-ui/src/app/(public)/login/page.tsx`), the UI:
  - saves the user in Zustand (includes `token`)
  - sets the `token` cookie
  - navigates to `/dashboard`

### API client + response shape

- Axios instance is created by `wexon-ui/src/api/getAxiosInstance.ts`:
  - `withCredentials: true`
  - adds `Authorization: Bearer <token>` header (token from Zustand, falling back to cookie)
  - response interceptor returns `response.data` (so callers receive the backend’s JSON body directly)
  - on `401`, it logs out, and redirects to `/login?destination=...&notify=...`
- Backend responses are typically `{ "message": string, "data": any }` (see backend `ApiResponse` / `ApiResult`).

## API base URL / proxying (important)

There are **two competing approaches** in the repo:

1) `wexon-ui/src/helpers/apiBase.ts` currently hard-codes the API root:
- `http://localhost:8083/api/<version>`

2) `wexon-ui/next.config.ts` defines a rewrite:
- `/api/:path*` → `http://localhost:8083/api/:path*`

Additionally:
- `wexon-ui/.env` and `wexon-ui/.env.production` define `NEXT_PUBLIC_*` variables, but they are **not referenced** by the current `apiBase.ts` implementation.

If you want a single source of truth, pick one approach (hard-coded base URL vs. `/api` rewrite) and remove/adjust the other.

## Code organization (high level)

- `wexon-ui/src/app/` — Next.js routes (App Router)
  - `wexon-ui/src/app/(public)/login/page.tsx` — login page
  - `wexon-ui/src/app/(protected)/dashboard/page.tsx` — dashboard landing
  - `wexon-ui/src/app/(protected)/layout.tsx` — protected shell (sidebar + breadcrumb + guards)
- `wexon-ui/src/api/` — API wrappers (inventory, products, vendors, warehouse, auth, etc.)
- `wexon-ui/src/components/` — UI and domain components
- `wexon-ui/src/assets/` — JSON schema form assets, images, etc.
- `wexon-ui/src/helpers/` — helpers (API base, breadcrumbs, cookies, shared props)
- `wexon-ui/src/store/` — Zustand stores (auth/user + permissions helpers)

## How to run (local)

From `wexon-ui/`:

- Install: `npm i`
- Dev server: `npm run dev`
- Open: `http://localhost:3000`

To have a working app you also need the backend running (default expectation in code is `http://localhost:8083`).

## Related docs

- Product/UX notes: `wexon-ui/ui_ux_context.md`
- System overview: `README.md` (repo root)

