export default function AuthHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#4dbb08]">
        {eyebrow}
      </p>

      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">
        {title}
      </h1>

      {description && (
        <p className="mt-3 text-sm leading-6 text-gray-500">{description}</p>
      )}
    </div>
  );
}
