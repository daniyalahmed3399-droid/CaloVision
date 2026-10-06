import { Pencil, Trash2 } from "lucide-react";

import { formatNumber } from "../../lib/tracking";

// One logged food. Edit/delete are only shown where the screen supports them.
export default function FoodLogRow({ log, onEdit, onDelete }) {
  const { nutrition } = log;

  return (
    <li className="flex items-center gap-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900">
          {log.name}
        </p>

        <p className="mt-0.5 text-xs text-gray-500">
          {formatNumber(log.quantity, 2)} {log.unit}
          <span className="mx-1.5 text-gray-300">·</span>
          P {formatNumber(nutrition.protein, 1)}g · C{" "}
          {formatNumber(nutrition.carbs, 1)}g · F {formatNumber(nutrition.fat, 1)}g
        </p>
      </div>

      <p className="shrink-0 text-sm font-bold text-gray-900">
        {formatNumber(nutrition.calories)}
        <span className="ml-1 text-xs font-medium text-gray-400">kcal</span>
      </p>

      {onEdit && (
        <button
          type="button"
          onClick={() => onEdit(log)}
          aria-label={`Edit ${log.name}`}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-800"
        >
          <Pencil size={16} />
        </button>
      )}

      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(log)}
          aria-label={`Delete ${log.name}`}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      )}
    </li>
  );
}
