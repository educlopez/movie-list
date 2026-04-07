"use client";

import useSWR from "swr";
import type { GenreListResponse } from "@/types";
import { fetcher } from "@/utils";

interface GenreFilterProps {
  onSelectGenre: (genreId: number | null) => void;
  selectedGenre: number | null;
}

export default function GenreFilter({
  selectedGenre,
  onSelectGenre,
}: GenreFilterProps) {
  const { data } = useSWR<GenreListResponse>("/api/genres?type=movie", fetcher);

  if (!data) {
    return null;
  }

  return (
    <div
      aria-label="Filter by genre"
      className="scrollbar-none flex gap-2 overflow-x-auto py-2"
      role="tablist"
    >
      <button
        aria-selected={selectedGenre === null}
        className={`flex-none rounded-full px-4 py-1.5 font-medium text-sm transition-colors ${
          selectedGenre === null
            ? "bg-emerald-500 text-white"
            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
        }`}
        onClick={() => onSelectGenre(null)}
        role="tab"
        type="button"
      >
        All
      </button>
      {data.genres.map((genre) => (
        <button
          aria-selected={selectedGenre === genre.id}
          className={`flex-none rounded-full px-4 py-1.5 font-medium text-sm transition-colors ${
            selectedGenre === genre.id
              ? "bg-emerald-500 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          }`}
          key={genre.id}
          onClick={() => onSelectGenre(genre.id)}
          role="tab"
          type="button"
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}
