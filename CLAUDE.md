# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # Next.js dev server (Turbopack), http://localhost:3000
npm run build   # production build; also the quickest full compile/type check
npm run lint    # ESLint (eslint-config-next core-web-vitals)
npx eslint <paths>   # lint specific files
```

There is no test runner configured. `npm run lint` is clean (0 errors; two `<img>` warnings).

## Stack notes

- **Next.js 16 (App Router), React 19, Tailwind CSS 4, JavaScript only** (no TypeScript). React Compiler is enabled in `next.config.mjs`. Animation is `motion/react`, icons are `lucide-react`.
- Next 16 differs from older versions you may remember: route protection lives in **`src/proxy.js`** (the renamed `middleware`). Version-matched docs are in `node_modules/next/dist/docs/` — check them before using unfamiliar APIs.
- `useSearchParams` requires a `<Suspense>` boundary or the build fails (see `(auth)/layout.js`, `onboarding/page.js`, `app/layout.js`).
- Import alias `@/*` → `src/*`, but existing code mostly uses relative imports.
- Brand colors are hard-coded Tailwind arbitrary values: green `#4dbb08`, dark `#17251a`, page background `#f6f9f1`, accent yellow `#f5d547`.

## Architecture

Two distinct halves share one app:

1. **Public marketing site + calculators** — `src/app/page.js` composes the landing sections in `src/components/*.jsx`. `/calorie-calculator`, `/recipe-nutrition` and `/meal-planner` are standalone tools (pure logic in `CaloriesCalculator.jsx`, `recipe/recipeUtils.js`, `meal-planner/mealPlannerUtils.js`, and `lib/bmi.js` for the landing-page BMI calculator; their state is in the Redux slices, and recipes/planner persist to `localStorage` via `persistence.js`). Keep validation and maths in pure modules like these, separate from components, so they can be tested without a browser. Numeric limits are shared across tools (height 120–230 cm, weight 30–300 kg, from `components/onboarding/options.js`). These three share one page design: green header band with a "Back to CaloVision" link, then `rounded-[24px]` cards. Match it for new tool pages.
2. **Authenticated web app** (implementing `~/Desktop/CaloVision_Guide.pdf`, a frontend build guide) — routes under `/app/*`, plus `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/onboarding`.

### State management (Redux Toolkit) — the standard for all new features

All shared, persisted or business state lives in a Redux Toolkit store in `src/lib/store/`; use it for new features instead of Context or ad-hoc `useState`/`localStorage`.

- `store.js` exports `makeStore()`; `StoreProvider.jsx` (root layout) creates one per render tree via `useState` — never a module-level singleton (it would leak state between users on the server). On mount it dispatches `hydratePersisted()` and `restoreSession()`, so browser-only reads happen after hydration.
- **Slices** (`slices/`): `auth`, `ui` (drawers, menus, pricing toggle), `onboarding`, `calorieCalculator`, `bmi`, `mealPlanner`, `recipe`. Add a feature by creating a slice and registering its reducer in `store.js`. Components read with `useAppSelector`/`useAppDispatch` from `hooks.js`.
- **Server data**: use RTK Query via `api.js` (`api.injectEndpoints`). Its base query reuses `lib/api/client.js`, so each endpoint's `query` is `{ name, body }` where `name` is a key in `lib/api/endpoints.js`. Use `tagTypes`/`invalidatesTags` so screens refresh after a mutation (e.g. logging a meal refreshes the dashboard). Don't write fetch thunks for backend data.
- **Persistence** is centralised in `persistence.js` (a listener middleware): meal planner auto-save, saved recipes, and the self-clearing save messages. Storage keys are unchanged (`calovision-meal-planner`, `calovision_saved_recipes`). Slices stay pure.
- **Derive, don't store**: computed values use memoized selectors (e.g. `selectRecipeNutrition`).
- **Logout resets** per-user slices (`onboarding`, account-only `ui` flags) through `extraReducers` on `logout.fulfilled`. Any new slice holding user-specific data must do the same.
- **Deliberately NOT in Redux**: password/credential fields (login, signup, reset forms) stay local state so they never appear in devtools or serialized state; also pure hover/animation state and `isHovered`-style micro-state.
- State must be serializable: failed thunks `rejectWithValue` a plain `{status, message, fieldErrors}`; `useAuth()` rethrows it as an `ApiError` so forms can show field errors.

### Auth, session and route protection (spans several files)

- The `auth` slice (`slices/authSlice.js`) owns `user` and `status` (`loading | authenticated | unauthenticated`) with thunks `restoreSession`, `login`, `signUp`, `logout`, `saveOnboarding`. Components use the `useAuth()` facade (`lib/store/useAuth.js`), which exposes `login`, `signUp`, `logout`, `saveOnboarding`, `applyUser` as plain async functions.
- Protection is two layers: `src/proxy.js` redirects logged-out visitors using a marker cookie (`cv_session`) before render; `AuthGate` (client) then verifies the session and routes by `mode`: `guest` (login/signup pages), `onboarding`, `app`. Un-onboarded users are forced to `/onboarding`; onboarded users are bounced out of it. `?next=` is honored only for same-site paths.
- `saveOnboarding` deliberately returns the updated user **without** putting it in `auth.user`; the `onboarding` slice keeps it as `reviewUser`, and only `applyUser` (on "Continue") flips `onboarded`, which is what triggers the redirect to the dashboard.
- `src/lib/session.js` is the only place that touches the token/cookie. Moving to a real httpOnly backend cookie means changing it and `proxy.js` together.
- **Hydration rule**: the store restores the session right after mount, but React hydrates `<Suspense>` boundaries later than that. `useAuth()` therefore reports `status: "loading"` / `user: null` until the page has hydrated (via `useSyncExternalStore`'s server snapshot). Read auth state only through `useAuth()` for anything rendered on the server; reading `state.auth` directly during hydration reintroduces the "server rendered HTML didn't match" error (seen in `(auth)/layout.js`). The same applies to any server-rendered UI whose first render depends on state that changes right after mount.

### API layer and the mock backend

The real CaloVision API docs have **not** been provided, so no endpoints are invented.

- UI code imports only from `src/lib/api/auth.js`, which picks the mock or the real client based on `NEXT_PUBLIC_USE_MOCK_API` (defaults to mock unless set to `false`).
- Real calls go through `src/lib/api/client.js`, which reads paths from `src/lib/api/endpoints.js` — every entry is `null` until the backend docs arrive. Fill those in, set the env var to `false`, then test each screen.
- `src/lib/api/mock.js` is a localStorage-backed stand-in (including a fake reset code and target calculation). It is development-only and is replaced wholesale, not extended.
- `src/lib/config.js` holds feature flags (`googleAuth`, `dietPreferences`, ...) that depend on backend confirmation. Errors are normalized to `ApiError` (`lib/api/errors.js`) so only user-safe messages reach the UI.

### Rules from the build guide worth remembering

- **Never compute calorie/macro/BMI targets in the frontend** for the authenticated app; display what the backend returns. (The public calorie and BMI calculators are separate marketing tools and do their own maths, with input validation.)
- Every API-backed screen needs loading, empty, error and validation states. Use `components/ui/Skeleton.jsx` (`PageSkeleton`, `SkeletonCard`, ...) and add `loading.js` files per route; `components/ui/` also has `Button`, `TextField`, `FormAlert`, `PageHeader`, `EmptyState`.
- Every page must work at mobile, tablet and desktop widths. The app shell (`components/app/`) uses a sidebar on desktop and bottom nav on mobile.
- Don't promise web-impossible features: no phone health-app step sync (manual entry only), browser notifications only on opt-in, web payments need a web provider (not mobile-store billing), voice/camera need permission-denied fallbacks.
- Most `/app/*` pages (`food`, `activity`, `progress`, `plans`, `settings`) are `ComingSoon` placeholders; only auth, onboarding and the shell are real.

## Known gaps (from the 2026-10-05 QA pass — delete each line when fixed)

- **Open redirect**: `safeNextPath` in `AuthGate.jsx` blocks `//host` and `https://host` but not `/\host` or `/<tab>/host`. Fix by parsing with `new URL(value, location.origin)` and requiring the same origin.
- **Mock is the default backend** when `NEXT_PUBLIC_USE_MOCK_API` is unset, including in production builds (plain-text passwords in localStorage, reset code shown on screen). It should default to mock only outside production.
- **Unlinked labels**: the BMI inputs and the `FoodRow` / `IngredientRow` fields have visible `<label>`s without `htmlFor`/`id`. `TextField` shows the correct pattern.
- **No error boundaries**: there is no `error.js`, `global-error.js` or `not-found.js`, no retry state when session restore fails, and no `ErrorState`/`Toast` components yet.
- **Calorie calculator floor**: the public calorie calculator can recommend ~400 kcal/day for extreme profiles; add a minimum and a warning.
- **No security headers** (CSP, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, HSTS) and `X-Powered-By` is exposed; set them in `next.config.mjs`.
- **Imperial height validation** in `onboarding/validate.js` and `CaloriesCalculator.jsx` accepts negative inches, and its message ("3'11\" and 7'7\"") disagrees with the 120–230 cm check at both ends (`lib/bmi.js` uses whole-inch limits to avoid this).
- **Heavy images**: the landing page loads ~3.7 MB (`main-hero.webp`, `bmi.webp` ≈1.1 MB each, `hero-bg.png`); components use `<img>` rather than `next/image`. Each `/app` placeholder page and the landing page also render two `<h1>`s.

## Local development gotchas

- Port 3000 may be occupied by another service on this machine; `.claude/launch.json` uses an auto-assigned port. A dev server may already be running (often on 3001) — check before starting another (Next refuses to run two).
- `.env.example` is tracked (via a `!.env.example` rule in `.gitignore`); real `.env*` files are ignored.
- **Testing without a test runner**: pure modules (`lib/bmi.js`, `onboarding/validate.js`, `recipeUtils.js`, `mealPlannerUtils.js`, `lib/api/mock.js` with a `localStorage` shim) can be exercised with plain Node scripts. Imports omit file extensions (bundler style), so Node needs a small resolver hook that appends `.js`; keep such scripts in the scratchpad, not the repo.
- **Browser verification**: when the Browser pane is hidden, `requestAnimationFrame` pauses, so `motion` exit animations never finish and `AnimatePresence mode="wait"` swaps (onboarding steps, BMI metric/imperial toggle) leave the old DOM in place. Assert on Redux state instead (find the store via the React fiber tree on `document`/`body` and read `getState()`), and dispatch actions directly where the UI can't render. For realistic QA run `npx next build && npx next start -p <port>`; stop it by PID (`ss -ltnp | grep :<port>`), because `pkill -f` can match your own shell.
