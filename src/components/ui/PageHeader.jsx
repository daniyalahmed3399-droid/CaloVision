export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#4dbb08]">
            {eyebrow}
          </p>
        )}

        <h1 className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}
