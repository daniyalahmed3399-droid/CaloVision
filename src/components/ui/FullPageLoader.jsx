export default function FullPageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen items-center justify-center bg-[#f6f9f1]"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#4dbb08]/20 border-t-[#4dbb08]" />
        <p className="text-sm font-medium text-gray-500">Loading…</p>
      </div>
    </div>
  );
}
