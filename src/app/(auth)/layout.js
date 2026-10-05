import { Suspense } from "react";
import Link from "next/link";
import { Flame } from "lucide-react";

import AuthGate from "../../components/auth/AuthGate";

// Shared frame for login, signup, forgot and reset password. Logged-in
// users are redirected away by AuthGate.
export default function AuthLayout({ children }) {
  return (
    <Suspense>
    <AuthGate mode="guest">
      <main className="grid min-h-screen bg-[#f6f9f1] lg:grid-cols-[0.9fr_1.1fr]">
        {/* Brand panel (desktop only) */}
        <aside className="relative hidden overflow-hidden bg-[#4dbb08] p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[50px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-40 left-[10%] h-72 w-72 rounded-full border-[45px] border-white/10" />

          <Link
            href="/"
            className="relative z-10 flex items-center gap-2 text-2xl font-extrabold text-white"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <Flame size={22} />
            </span>
            CaloVision
          </Link>

          <div className="relative z-10 max-w-md">
            <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white">
              Eat smarter.
              <span className="block text-[#f5d547]">
                Know your numbers.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-white/90">
              Track meals, activity and progress with a calorie target built
              around your goals.
            </p>
          </div>

          <p className="relative z-10 text-xs text-white/70">
            © CaloVision
          </p>
        </aside>

        {/* Form area */}
        <div className="flex flex-col px-5 py-8 sm:px-8">
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 text-xl font-extrabold text-gray-900 lg:hidden"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4dbb08] text-white">
              <Flame size={19} />
            </span>
            CaloVision
          </Link>

          <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-6">
            {children}
          </div>
        </div>
      </main>
    </AuthGate>
    </Suspense>
  );
}
