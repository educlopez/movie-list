"use client";

import Link from "next/link";
import useSWR from "swr";
import type { TMDBPaginatedResponse } from "@/types";
import { fetcher } from "@/utils";
import CardSkeleton from "./CardSkeleton";
import MovieCard from "./MovieCard";

interface CardRowProps {
  endpoint: string;
  mediaType?: "movie" | "tv";
  seeMoreHref: string;
  title: string;
}

export default function CardRow({
  title,
  endpoint,
  seeMoreHref,
  mediaType = "movie",
}: CardRowProps) {
  const { data, error } = useSWR<TMDBPaginatedResponse>(endpoint, fetcher);

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-lg text-zinc-900 dark:text-white">
          {title}
        </h2>
        <Link
          className="font-medium text-emerald-500 text-sm hover:text-emerald-600"
          href={seeMoreHref}
        >
          See more
        </Link>
      </div>

      {error && (
        <div
          className="rounded-lg bg-red-50 p-4 text-red-600 text-sm dark:bg-red-900/20 dark:text-red-400"
          role="alert"
        >
          Could not load {title.toLowerCase()}. Please try again later.
        </div>
      )}

      {!(data || error) && <CardSkeleton />}

      {data && (
        <div className="scrollbar-none flex gap-4 overflow-x-auto pb-2">
          {data.results.slice(0, 14).map((item) => (
            <div className="flex-none" key={item.id}>
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
        </div>
      )}
    </section>
  );
}
