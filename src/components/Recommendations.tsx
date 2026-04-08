"use client";

import useSWRImmutable from "swr/immutable";
import { useDragScroll } from "@/hooks/useDragScroll";
import MovieCard from "@/components/MovieCard";
import type { TMDBMediaItem } from "@/types/tmdb";
import { fetcher } from "@/utils";

interface RecommendationsProps {
  mediaType: "movie" | "tv";
  id: number;
}

export default function Recommendations({
  mediaType,
  id,
}: RecommendationsProps) {
  const { data, error } = useSWRImmutable<TMDBMediaItem[]>(
    `/api/${mediaType}/${id}/recommendations`,
    fetcher
  );
  const scrollRef = useDragScroll<HTMLUListElement>();

  if (error || !data || data.length === 0) {
    return null;
  }

  const items = data.slice(0, 12);

  return (
    <section className="mt-8">
      <h3 className="mb-4 font-semibold text-lg text-zinc-900 dark:text-white">
        Recomendaciones
      </h3>
      <ul
        ref={scrollRef}
        className="scrollbar-none flex select-none gap-4 overflow-x-auto pt-2 pb-2"
      >
        {items.map((item) => (
          <div className="w-[150px] flex-none" key={item.id}>
            <MovieCard
              category={item.media_type || mediaType}
              id={item.id}
              src={item.poster_path || item.backdrop_path || ""}
              title={
                item.title || item.original_name || item.original_title || ""
              }
              vote_average={item.vote_average}
              year={item.release_date || item.first_air_date}
            />
          </div>
        ))}
      </ul>
    </section>
  );
}
