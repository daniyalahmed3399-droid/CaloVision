# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # Next.js dev server (Turbopack), http://localhost:3000
npm run build   # production build; also the quickest full compile/type check
npm run lint    # ESLint (eslint-config-next core-web-vitals)
npx eslint <paths>   # lint specific files
```

There is no test runner configured. `npm run lint` currently reports pre-existing `react-hooks/set-state-in-effect` errors in `meal-planner/` and `recipe/`; lint only the files you touch.

## Stack notes

- **Next.js 16 (App Router), React 19, Tailwind CSS 4, JavaScript only** (no TypeScript). React Compiler is enabled in `next.config.mjs`. Animation is `motion/react`, icons are `lucide-react`.
- Next 16 differs from older versions you may remember: route protection lives in **`src/proxy.js`** (the renamed `middleware`). Version-matched docs are in `node_modules/next/dist/docs/` — check them before using unfamiliar APIs.
- `useSearchParams` requires a `<Suspense>` boundary or the build fails (see `(auth)/layout.js`, `onboarding/page.js`, `app/layout.js`).
- Import alias `@/*` → `src/*`, but existing code mostly uses relative imports.
- Brand colors are hard-coded Tailwind arbitrary values: green `#4dbb08`, dark `#17251a`, page background `#f6f9f1`, accent yellow `#f5d547`.

## Architecture

Two distinct halves share one app:

1. **Public marketing site + calculators** — `src/app/page.js` composes the landing sections in `src/components/*.jsx`. `/calorie-calculator`, `/recipe-nutrition` and `/meal-planner` are standalone tools (logic in `CaloriesCalculator.jsx`, `recipe/recipeUtils.js`, `meal-planner/mealPlannerUtils.js`; recipes and planner persist to `localStorage`). These three share one page design: green header band with a "Back to CaloVision" link, then `rounded-[24px]` cards. Match it for new tool pages.
2. **Authenticated web app** (implementing `~/Desktop/CaloVision_Guide.pdf`, a frontend build guide) — routes under `/app/*`, plus `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/onboarding`.

### Auth, session and route protection (spans several files)

- `src/components/auth/AuthProvider.jsx` (mounted in the root layout) owns `user` and `status` (`loading | authenticated | unauthenticated`) and restores the session from a token in localStorage on load. `useAuth()` exposes `login`, `signUp`, `logout`, `saveOnboarding`, `applyUser`.
- Protection is two layers: `src/proxy.js` redirects logged-out visitors using a marker cookie (`cv_session`) before render; `AuthGate` (client) then verifies the session and routes by `mode`: `guest` (login/signup pages), `onboarding`, `app`. Un-onboarded users are forced to `/onboarding`; onboarded users are bounced out of it. `?next=` is honored only for same-site paths.
- `saveOnboarding` deliberately returns the updated user **without** putting it in context; the review step shows the backend targets and only `applyUser` (on "Continue") flips `onboarded`, which is what triggers the redirect to the dashboard.
- `src/lib/session.js` is the only place that touches the token/cookie. Moving to a real httpOnly backend cookie means changing it and `proxy.js` together.

### API layer and the mock backend

The real CaloVision API docs have **not** been provided, so no endpoints are invented.

- UI code imports only from `src/lib/api/auth.js`, which picks the mock or the real client based on `NEXT_PUBLIC_USE_MOCK_API` (defaults to mock unless set to `false`).
- Real calls go through `src/lib/api/client.js`, which reads paths from `src/lib/api/endpoints.js` — every entry is `null` until the backend docs arrive. Fill those in, set the env var to `false`, then test each screen.
- `src/lib/api/mock.js` is a localStorage-backed stand-in (including a fake reset code and target calculation). It is development-only and is replaced wholesale, not extended.
- `src/lib/config.js` holds feature flags (`googleAuth`, `dietPreferences`, ...) that depend on backend confirmation. Errors are normalized to `ApiError` (`lib/api/errors.js`) so only user-safe messages reach the UI.

### Rules from the build guide worth remembering

- **Never compute calorie/macro/BMI targets in the frontend** for the authenticated app; display what the backend returns. (The public calorie calculator page is a separate marketing tool and does its own maths.)
- Every API-backed screen needs loading, empty, error and validation states. Use `components/ui/Skeleton.jsx` (`PageSkeleton`, `SkeletonCard`, ...) and add `loading.js` files per route; `components/ui/` also has `Button`, `TextField`, `FormAlert`, `PageHeader`, `EmptyState`.
- Every page must work at mobile, tablet and desktop widths. The app shell (`components/app/`) uses a sidebar on desktop and bottom nav on mobile.
- Don't promise web-impossible features: no phone health-app step sync (manual entry only), browser notifications only on opt-in, web payments need a web provider (not mobile-store billing), voice/camera need permission-denied fallbacks.
- Most `/app/*` pages (`food`, `activity`, `progress`, `plans`, `settings`) are `ComingSoon` placeholders; only auth, onboarding and the shell are real.

## Local development gotchas

- Port 3000 may be occupied by another service on this machine; `.claude/launch.json` uses an auto-assigned port. A dev server may already be running — check before starting another (Next refuses to run two).
- `.env.example` is tracked (via a `!.env.example` rule in `.gitignore`); real `.env*` files are ignored.
