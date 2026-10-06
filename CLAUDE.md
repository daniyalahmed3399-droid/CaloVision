# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # Next.js dev server (Turbopack), http://localhost:3000
npm run build   # production build; also the quickest full compile/type check
npm run lint    # ESLint (eslint-config-next core-web-vitals)
npx eslint <paths>   # lint specific files
```

There is no test runner configured. `npm run lint` is clean (0 errors; one `<img>` warning in `BMICalculator`).

## Stack notes

- **Next.js 16 (App Router), React 19, Tailwind CSS 4, JavaScript only** (no TypeScript). React Compiler is enabled in `next.config.mjs`. Animation is `motion/react`, icons are `lucide-react`.
- Next 16 differs from older versions you may remember: route protection lives in **`src/proxy.js`** (the renamed `middleware`). Version-matched docs are in `node_modules/next/dist/docs/` — check them before using unfamiliar APIs.
- `useSearchParams` requires a `<Suspense>` boundary or the build fails (see `(auth)/layout.js`, `onboarding/page.js`, `app/layout.js`).
- Import alias `@/*` → `src/*`, but existing code mostly uses relative imports.
- Brand colors are hard-coded Tailwind arbitrary values: green `#4dbb08`, dark `#17251a`, page background `#f6f9f1`, accent yellow `#f5d547`.

## Architecture

Two distinct halves share one app:

1. **Public marketing site + calculators** — `src/app/page.js` composes the landing sections in `src/components/*.jsx`. `/calorie-calculator`, `/recipe-nutrition` and `/meal-planner` are standalone tools (pure logic in `CaloriesCalculator.jsx`, `recipe/recipeUtils.js`, `meal-planner/mealPlannerUtils.js`, and `lib/bmi.js` for the landing-page BMI calculator; their state is in the Redux slices, and recipes/planner persist to `localStorage` via `persistence.js`). Keep validation and maths in pure modules like these, separate from components, so they can be tested without a browser. Numeric limits are shared across tools (height 120–230 cm, weight 30–300 kg, from `components/onboarding/options.js`). These three share one page design: green header band with a "Back to CaloVision" link, then `rounded-[24px]` cards. Match it for new tool pages.
   **Landing page layout** (`src/app/page.js`): Navbar → `MainHero` (`#home`) → `BMICalculator` (`#bmi`, the hero button jumps here) → `AICoaching` (`#ai-coaching`) → `AboutSection` → `Pricing` → `AppBanner` (`#get-the-app`) → `Footer` (`#contact`). The navbar is a full-width bar fixed to the top (76px + 1px border), and `globals.css` sets `section { scroll-margin-top: 77px }` to match, so anchor jumps land flush under it; change both together. The old Services, Expertise, Blog, Appointment and Video Testimonials sections were removed, and the "Weight Loss Program" photo gallery moved into the app dashboard as `tracking/TransformationGallery.jsx`. `AppBanner` is the first user of `next/image`; the Next 16 `images.qualities` list in `next.config.mjs` must include any `quality` you pass.
2. **Authenticated web app** (implementing `~/Desktop/CaloVision_Guide.pdf`, a frontend build guide) — routes under `/app/*`, plus `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/onboarding`.

### State management (Redux Toolkit) — the standard for all new features

All shared, persisted or business state lives in a Redux Toolkit store in `src/lib/store/`; use it for new features instead of Context or ad-hoc `useState`/`localStorage`.

- `store.js` exports `makeStore()`; `StoreProvider.jsx` (root layout) creates one per render tree via `useState` — never a module-level singleton (it would leak state between users on the server). On mount it dispatches `hydratePersisted()` and `restoreSession()`, so browser-only reads happen after hydration.
- **Slices** (`slices/`): `auth`, `ui` (drawers, menus, pricing toggle, toast queue), `onboarding`, `calorieCalculator`, `bmi`, `mealPlanner`, `recipe`, `tracking` (the selected calendar date). Add a feature by creating a slice and registering its reducer in `store.js`. Components read with `useAppSelector`/`useAppDispatch` from `hooks.js`.
- **Server data**: use RTK Query via `api.js` (`api.injectEndpoints`). Its base query reuses `lib/api/client.js`, so each endpoint's `query` is `{ name, body }` where `name` is a key in `lib/api/endpoints.js`. Use `tagTypes`/`invalidatesTags` so screens refresh after a mutation (e.g. logging a meal refreshes the dashboard). Don't write fetch thunks for backend data.
- **Persistence** is centralised in `persistence.js` (a listener middleware): meal planner auto-save, saved recipes, and the self-clearing save messages. Storage keys are unchanged (`calovision-meal-planner`, `calovision_saved_recipes`). Slices stay pure.
- **Derive, don't store**: computed values use memoized selectors (e.g. `selectRecipeNutrition`).
- **Logout resets** per-user slices (`onboarding`, account-only `ui` flags) through `extraReducers` on `logout.fulfilled`. Any new slice holding user-specific data must do the same.
- **Deliberately NOT in Redux**: password/credential fields (login, signup, reset forms) stay local state so they never appear in devtools or serialized state; also pure hover/animation state and `isHovered`-style micro-state.
- State must be serializable: failed thunks `rejectWithValue` a plain `{status, message, fieldErrors}`; `useAuth()` rethrows it as an `ApiError` so forms can show field errors.

### Tracking: dashboard, food, activity, steps, weight (spans several files)

The real implementation of the Today dashboard and core tracking; follow its pattern for the remaining server-backed screens (progress, plans, ...).

- **Data flow**: components → RTK Query hooks in `lib/store/endpoints/trackingApi.js` → `lib/store/api.js` base query → `mockTracking[name]` (mock mode) or `lib/api/client.request(name)` (real). Endpoint names are keys in `lib/api/endpoints.js` (all `null` until the real API exists; `client.js` fills `:path` params and GET query strings from `params`).
- **One cached "day"**: `getDay({ date })` returns everything the dashboard, meal history and activity pages need for a date (targets, totals, per-meal items, `remainingCalories`, exercise + calories burned, steps, latest weight). Day-scoped mutations (log/edit/delete food, log/delete exercise, set steps) take `date` in their args and invalidate `{ type: "Day", id: date }`; `logWeight` invalidates all `"Day"` (the latest weight carries forward to later days) plus `"Weight"`. This is what makes the dashboard update after anything is saved; don't bypass it with local state.
- **Use `currentData`, not `data`**, for queries whose args change (day by date, food preview): `data` keeps the previous arg's result, which shows the wrong day/quantity while the new one loads. `useSelectedDate()` (`lib/store/`) supplies the shared date; it never goes into the future, and `selectedDate: null` means "follow today".
- **Never calculate nutrition, calories burned or "remaining" in the UI**: values come from the backend (the mock plays the backend in `lib/api/mockTracking.js`: totals, MET-based exercise calories, server-side validation). The food-detail preview is a backend call (`previewFood`), debounced via `useDebouncedValue`.
- **Pure helpers**: `lib/dates.js` (dates are local `"YYYY-MM-DD"` strings; use `addDays`, not `Date` maths) and `lib/tracking.js` (validators shared by forms and the mock, `MEAL_ORDER`/`MEAL_OPTIONS`, weight unit helpers). Weight is stored in kg to 2 decimals and shown in the unit chosen at onboarding (`weightUnitFor(user)`); 2 decimals keeps a typed value exact on the round trip.
- **Dashboard layout breakpoints** (`Dashboard.jsx`): from `xl` (1280px) the photo gallery (`TransformationGallery`) is a 300px column on the right with its photos stacked vertically; below `xl` it is a full-width card under the day's cards (photos in a row at `lg`, a swipeable carousel below). Inside the main area, meals and the activity cards (steps, weight, exercise) sit side by side only from `2xl`; otherwise the activity cards drop under the meals in a two-column grid. Keep the gallery outside the data-loading branches so it shows even if the day fails to load.
- **Steps**: `count: null` means not logged and `0` is a real value, so they render differently. Manual entry only.
- **Dialog pattern**: `ui/Modal` (focus trap, Escape, backdrop, scroll lock, no exit animation) wraps a separate `*Form` component that is mounted only while open, so fields reset each time. Mutation failures go through `toFormError(error)` into field errors plus a `FormAlert`; success dispatches `toastShown(...)`. Destructive actions use `ConfirmDialog`. Failed loads render `ErrorState` with Retry, never an empty state.
- `sessionListener.js` calls `api.util.resetApiState()` on login, signup and logout so one user's cached data is never shown to the next. `trackingSlice` and `uiSlice` reset on logout too.

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
- Every API-backed screen needs loading, empty, error and validation states. Use `components/ui/Skeleton.jsx` (`PageSkeleton`, `SkeletonCard`, ...) and add `loading.js` files per route; `components/ui/` also has `Button`, `TextField`, `SelectField`, `FormAlert`, `PageHeader`, `EmptyState`, `ErrorState`, `Modal`, `ConfirmDialog`, `Toaster` (mounted in `AppShell`), `ProgressBar`.
- Each page has exactly one `<h1>` (the top bar's title is a `<p>`); use an `sr-only` `<h2>` before groups of `<h3>` cards so heading levels don't skip. Tap targets should be at least 40px high.
- Every page must work at mobile, tablet and desktop widths. The app shell (`components/app/`) uses a sidebar on desktop and bottom nav on mobile.
- Don't promise web-impossible features: no phone health-app step sync (manual entry only), browser notifications only on opt-in, web payments need a web provider (not mobile-store billing), voice/camera need permission-denied fallbacks.
- Real so far: auth, onboarding, the shell, `/app/dashboard`, `/app/food` (+ `/add`, `/add/search`) and `/app/activity`. `/app/progress`, `/app/plans` and `/app/settings` are still `ComingSoon` placeholders, and the AI food methods (photo, text, voice) are shown as "Coming soon" on `/app/food/add`.

## Known gaps (from the 2026-10-05 QA pass — delete each line when fixed)

- **Open redirect**: `safeNextPath` in `AuthGate.jsx` blocks `//host` and `https://host` but not `/\host` or `/<tab>/host`. Fix by parsing with `new URL(value, location.origin)` and requiring the same origin.
- **Mock is the default backend** when `NEXT_PUBLIC_USE_MOCK_API` is unset, including in production builds (plain-text passwords in localStorage, reset code shown on screen). It should default to mock only outside production.
- **Unlinked labels**: the BMI inputs and the `FoodRow` / `IngredientRow` fields have visible `<label>`s without `htmlFor`/`id`. `TextField` shows the correct pattern.
- **No error boundaries**: there is no `error.js`, `global-error.js` or `not-found.js`, and no retry state when session restore fails (`ErrorState` and toasts now exist for data screens).
- **Calorie calculator floor**: the public calorie calculator can recommend ~400 kcal/day for extreme profiles; add a minimum and a warning.
- **No security headers** (CSP, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, HSTS) and `X-Powered-By` is exposed; set them in `next.config.mjs`.
- **Imperial height validation** in `onboarding/validate.js` and `CaloriesCalculator.jsx` accepts negative inches, and its message ("3'11\" and 7'7\"") disagrees with the 120–230 cm check at both ends (`lib/bmi.js` uses whole-inch limits to avoid this).
- **Heavy images**: `main-hero.webp`, `bmi.webp` (≈1.1 MB each) and `hero-bg.png` are served raw through `<img>`; only `AppBanner` uses `next/image` (which serves ~110 KB instead of 1.3 MB). `CaloVisionCSBanner.webp` is really a PNG with a `.webp` extension (it works because Next sniffs the content). `AppBanner` shows it whole in a `#4dbb08` border on tablet/desktop and crops to the phones (`CROP`, in image pixels) on phones, so re-check `CROP` when the artwork is replaced. The landing page also renders two `<h1>`s.
- **Global `img { max-width: 100% }`** in `globals.css` is unlayered, so it beats Tailwind's `max-w-*` utilities; set `maxWidth` inline when an image must exceed its container (see the phone crop in `AppBanner`).
- **Placeholder pricing**: `Pricing.jsx` shows template plans (Post Pregnancy / Weight Loss / Body Sculpting, made-up prices, "optimize web queries" blurb). The guide (section 14) specifies Free vs Premium with a feature comparison, backend entitlement and a web payment provider, none confirmed. The owner will replace it once the real plans are known; do not invent prices or features.
- **Unused leftovers**: `swiper` (dependency) and `public/images/service-*.webp`, `blog-*.webp`, `testimonial-*.webp` are no longer referenced. The navbar's "Elements" link still points at a non-existent `#elements`.

## Local development gotchas

- **Replaced a `public/` image but the page still shows the old one?** The dev image optimizer caches resized copies by URL, not file content. Delete `.next/dev/cache/images` (a production build uses `.next/cache/images`) and hard-reload.
- Port 3000 may be occupied by another service on this machine; `.claude/launch.json` uses an auto-assigned port. A dev server may already be running (often on 3001) — check before starting another (Next refuses to run two).
- `.env.example` is tracked (via a `!.env.example` rule in `.gitignore`); real `.env*` files are ignored.
- **Testing without a test runner**: pure modules (`lib/bmi.js`, `onboarding/validate.js`, `recipeUtils.js`, `mealPlannerUtils.js`, `lib/api/mock.js` with a `localStorage` shim) can be exercised with plain Node scripts. Imports omit file extensions (bundler style), so Node needs a small resolver hook that appends `.js`; keep such scripts in the scratchpad, not the repo.
- **Browser verification**: when the Browser pane is hidden, `requestAnimationFrame` pauses, so `motion` exit animations never finish and `AnimatePresence mode="wait"` swaps (onboarding steps, BMI metric/imperial toggle) leave the old DOM in place. Assert on Redux state instead (find the store via the React fiber tree on `document`/`body` and read `getState()`), and dispatch actions directly where the UI can't render. For realistic QA run `npx next build && npx next start -p <port>`; stop it by PID (`ss -ltnp | grep :<port>`), because `pkill -f` can match your own shell.
