"use client";

import useSWR from "swr";
import type { GenreListResponse } from "@/types/tmdb";
import { fetcher } from "@/utils";

interface Filters {
  genre: string;
  rating: string;
  year: string;
}

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const { data: genreData } = useSWR<GenreListResponse>(
    "/api/genres?type=movie",
    fetcher
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const selectClass =
    "rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        className={selectClass}
        onChange={(e) => onFilterChange({ ...filters, genre: e.target.value })}
        value={filters.genre}
      >
        <option value="">All Genres</option>
        {genreData?.genres.map((g) => (
          <option key={g.id} value={g.id.toString()}>
            {g.name}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        onChange={(e) => onFilterChange({ ...filters, year: e.target.value })}
        value={filters.year}
      >
        <option value="">All Years</option>
        {years.map((y) => (
          <option key={y} value={y.toString()}>
            {y}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        onChange={(e) => onFilterChange({ ...filters, rating: e.target.value })}
        value={filters.rating}
      >
        <option value="">Any Rating</option>
        <option value="7">7+</option>
        <option value="6">6+</option>
        <option value="5">5+</option>
      </select>

      {(filters.genre || filters.year || filters.rating) && (
        <button
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          onClick={() => onFilterChange({ genre: "", year: "", rating: "" })}
          type="button"
        >
          Reset
        </button>
      )}
    </div>
  );
}
