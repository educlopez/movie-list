"use client";

interface TrendingToggleProps {
  onChange: (time: "day" | "week") => void;
  timeWindow: "day" | "week";
}

export default function TrendingToggle({
  timeWindow,
  onChange,
}: TrendingToggleProps) {
  return (
    <div
      aria-label="Trending time window"
      className="inline-flex rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800"
      role="tablist"
    >
      <button
        aria-selected={timeWindow === "day"}
        className={`rounded-md px-3 py-1 font-medium text-sm transition-colors ${
          timeWindow === "day"
            ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        }`}
        onClick={() => onChange("day")}
        role="tab"
        type="button"
      >
        Today
      </button>
      <button
        aria-selected={timeWindow === "week"}
        className={`rounded-md px-3 py-1 font-medium text-sm transition-colors ${
          timeWindow === "week"
            ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        }`}
        onClick={() => onChange("week")}
        role="tab"
        type="button"
      >
        This week
      </button>
    </div>
  );
}
