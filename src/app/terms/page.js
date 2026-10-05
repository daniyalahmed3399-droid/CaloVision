import Link from "next/link";

export const metadata = { title: "Terms | CaloVision" };

// Placeholder: legal copy needs to be supplied by the product/legal team.
export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-3xl font-extrabold text-gray-900">Terms</h1>
      <p className="mt-4 text-sm leading-7 text-gray-500">
        Terms of service will be published here.
      </p>
      <Link href="/signup" className="mt-8 inline-block text-sm font-semibold text-[#3c9705] hover:underline">
        ← Back to sign up
      </Link>
    </main>
  );
}
