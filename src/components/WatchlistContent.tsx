"use client";

import { useMemo, useState } from "react";
import { useWatchlist, type WatchlistItem } from "@/stores/watchlist";
import MovieCard from "@/components/MovieCard";

type FilterType = "all" | "movie" | "tv";
type SortType = "recent" | "title";

const filterTabs: { label: string; value: FilterType }[] = [
  { label: "Todos", value: "all" },
  { label: "Peliculas", value: "movie" },
  { label: "Series", value: "tv" },
];

const sortOptions: { label: string; value: SortType }[] = [
  { label: "Recientes", value: "recent" },
  { label: "Titulo", value: "title" },
];

export default function WatchlistContent() {
  const { items, removeItem } = useWatchlist();
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("recent");

  const filteredAndSorted = useMemo(() => {
    let result = [...items];

    if (filter !== "all") {
      result = result.filter((item) => item.media_type === filter);
    }

    if (sort === "recent") {
      result.sort((a, b) => b.added_at - a.added_at);
    } else {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [items, filter, sort]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg
          className="mb-4 h-16 w-16 text-zinc-300 dark:text-zinc-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">
          Tu lista esta vacia
        </p>
        <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
          Agrega peliculas y series desde sus paginas de detalle.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter tabs */}
        <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
          {filterTabs.map((tab) => (
            <button
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                filter === tab.value
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Ordenar:
            </span>
            <select
              className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              onChange={(e) => setSort(e.target.value as SortType)}
              value={sort}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Count */}
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {filteredAndSorted.length}{" "}
            {filteredAndSorted.length === 1 ? "titulo" : "titulos"}
          </span>
        </div>
      </div>

      {/* Grid */}
      {filteredAndSorted.length === 0 ? (
        <p className="py-10 text-center text-sm text-zinc-400 dark:text-zinc-500">
          No hay resultados con el filtro seleccionado.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredAndSorted.map((item: WatchlistItem) => (
            <li key={`${item.media_type}-${item.id}`} className="relative">
              <button
                aria-label={`Quitar ${item.title} de la lista`}
                className="absolute top-1 right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-red-600"
                onClick={() => removeItem(item.id, item.media_type)}
                type="button"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <MovieCard
                category={item.media_type}
                id={item.id}
                src={item.poster_path}
                title={item.title}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
