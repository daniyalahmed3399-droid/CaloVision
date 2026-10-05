export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center rounded-[24px] border border-dashed border-gray-200 bg-white px-6 py-14 text-center">
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf5df] text-[#4dbb08]">
          <Icon size={26} />
        </div>
      )}

      <h2 className="mt-5 text-lg font-bold text-gray-900">{title}</h2>

      {description && (
        <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
