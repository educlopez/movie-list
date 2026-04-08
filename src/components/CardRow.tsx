"use client";

import { useMemo } from "react";
import Link from "next/link";
import useSWR from "swr";
import { useDragScroll } from "@/hooks/useDragScroll";
import type { TMDBMediaItem, TMDBPaginatedResponse } from "@/types/tmdb";
import { fetcher } from "@/utils";
import CardSkeleton from "./CardSkeleton";
import MovieCard from "./MovieCard";

export interface CardRowFilters {
  genre?: number | null;
  rating?: number | null;
  year?: number | null;
}

interface CardRowProps {
  endpoint: string;
  filters?: CardRowFilters;
  hideTitle?: boolean;
  mediaType?: "movie" | "tv";
  seeMoreHref: string;
  title: string;
}

function applyFilters(
  items: TMDBMediaItem[],
  filters?: CardRowFilters
): TMDBMediaItem[] {
  if (!filters) return items;
  return items.filter((item) => {
    if (filters.genre != null) {
      if (!item.genre_ids?.includes(filters.genre)) return false;
    }
    if (filters.year != null) {
      const date = item.release_date || item.first_air_date || "";
      const itemYear = date ? Number(date.slice(0, 4)) : 0;
      if (itemYear !== filters.year) return false;
    }
    if (filters.rating != null) {
      if ((item.vote_average ?? 0) < filters.rating) return false;
    }
    return true;
  });
}

export default function CardRow({
  title,
  endpoint,
  seeMoreHref,
  mediaType = "movie",
  hideTitle = false,
  filters,
}: CardRowProps) {
  const { data, error } = useSWR<TMDBPaginatedResponse>(endpoint, fetcher);
  const scrollRef = useDragScroll<HTMLUListElement>();

  const filteredResults = useMemo(() => {
    if (!data) return [];
    return applyFilters(data.results, filters).slice(0, 14);
  }, [data, filters]);

  const hasActiveFilters =
    filters &&
    (filters.genre != null || filters.year != null || filters.rating != null);

  return (
    <section className="mb-8">
      {!hideTitle && (
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-lg text-zinc-900 dark:text-white">
            {title}
          </h2>
          <Link
            className="font-medium text-emerald-500 text-sm hover:text-emerald-600"
            href={seeMoreHref}
          >
            Ver más
          </Link>
        </div>
      )}

      {error && (
        <div
          className="rounded-lg bg-red-50 p-4 text-red-600 text-sm dark:bg-red-900/20 dark:text-red-400"
          role="alert"
        >
          No se pudo cargar {title.toLowerCase()}. Inténtalo de nuevo más tarde.
        </div>
      )}

      {!(data || error) && <CardSkeleton />}

      {data && filteredResults.length === 0 && hasActiveFilters && (
        <p className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Sin resultados con los filtros seleccionados.
        </p>
      )}

      {data && filteredResults.length > 0 && (
        <ul
          className="scrollbar-none flex select-none gap-4 overflow-x-auto pt-2 pb-2"
          ref={scrollRef}
        >
          {filteredResults.map((item) => (
            <div className="w-[150px] flex-none" key={item.id}>
              <MovieCard
                category={item.media_type || mediaType}
                id={item.id}
                rating={item.adult}
                src={
                  item.poster_path ? item.poster_path : item.backdrop_path || ""
                }
                title={
                  item.title || item.original_name || item.original_title || ""
                }
                vote_average={item.vote_average}
                year={item.release_date || item.first_air_date}
              />
            </div>
          ))}
        </ul>
      )}
    </section>
  );
}
