import Link from "next/link";
import { Plus } from "lucide-react";

import FoodLogRow from "./FoodLogRow";
import { formatNumber } from "../../lib/tracking";

// A meal (breakfast, lunch, dinner or snacks): its logged foods, the meal's
// calorie total from the backend, and a way to add food to it.
export default function MealLogSection({ meal, label, data, onEdit, onDelete }) {
  const { items, totals } = data;

  return (
    <section
      aria-labelledby={`meal-${meal}`}
      className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 id={`meal-${meal}`} className="text-base font-bold text-gray-900">
            {label}
          </h3>

          <p className="mt-0.5 text-xs text-gray-500">
            {items.length === 0
              ? "Nothing logged yet"
              : `${formatNumber(totals.calories)} kcal · ${items.length} ${
                  items.length === 1 ? "item" : "items"
                }`}
          </p>
        </div>

        <Link
          href={`/app/food/add/search?meal=${meal}`}
          aria-label={`Add food to ${label}`}
          className="flex min-h-10 items-center gap-1.5 rounded-xl bg-[#eaf7df] px-4 py-2.5 text-xs font-bold text-[#3c9705] transition-colors hover:bg-[#dff1cf]"
        >
          <Plus size={15} />
          Add
        </Link>
      </div>

      {items.length > 0 && (
        <ul className="mt-2 divide-y divide-gray-100">
          {items.map((log) => (
            <FoodLogRow
              key={log.id}
              log={log}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
