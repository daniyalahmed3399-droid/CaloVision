// `hideTitle` keeps the <h1> for screen readers but drops the visible
// eyebrow and title, for pages whose title is already shown in the top bar.
export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
  hideTitle = false,
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && !hideTitle && (
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#4dbb08]">
            {eyebrow}
          </p>
        )}

        <h1
          className={
            hideTitle
              ? "sr-only"
              : "mt-1 text-[clamp(1.375rem,6vw,1.875rem)] font-extrabold leading-tight text-gray-900"
          }
        >
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
