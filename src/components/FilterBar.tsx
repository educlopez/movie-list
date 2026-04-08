"use client";

interface FilterBarProps {
  onRatingChange: (rating: number | null) => void;
  onYearChange: (year: number | null) => void;
  selectedRating: number | null;
  selectedYear: number | null;
}

const YEARS = Array.from({ length: 10 }, (_, i) => 2026 - i);

const RATINGS = [
  { label: "7+", value: 7 },
  { label: "6+", value: 6 },
  { label: "5+", value: 5 },
];

export default function FilterBar({
  onRatingChange,
  onYearChange,
  selectedRating,
  selectedYear,
}: FilterBarProps) {
  const selectBase =
    "rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:border-zinc-300 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600 dark:focus:border-emerald-500";

  const hasFilters = selectedYear !== null || selectedRating !== null;

  return (
    <div className="flex items-center gap-3">
      <select
        aria-label="Filtrar por año"
        className={selectBase}
        onChange={(e) =>
          onYearChange(e.target.value ? Number(e.target.value) : null)
        }
        value={selectedYear ?? ""}
      >
        <option value="">Año</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <select
        aria-label="Filtrar por puntuación"
        className={selectBase}
        onChange={(e) =>
          onRatingChange(e.target.value ? Number(e.target.value) : null)
        }
        value={selectedRating ?? ""}
      >
        <option value="">Puntuación</option>
        {RATINGS.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          onClick={() => {
            onYearChange(null);
            onRatingChange(null);
          }}
          type="button"
        >
          Limpiar
        </button>
      )}
    </div>
  );
}
