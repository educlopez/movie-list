"use client";

import type { DiscoverItem } from "@/types/tmdb";
import MovieCard from "./MovieCard";

interface TimelineGroupProps {
  date: string;
  items: DiscoverItem[];
  label: string;
}

export default function TimelineGroup({ label, items }: TimelineGroupProps) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-emerald-500" />
        <h3 className="font-semibold text-zinc-900 dark:text-white">{label}</h3>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {items.length} titles
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8">
        {items.map((item) => (
          <MovieCard
            category={item.media_type}
            id={item.id}
            key={`${item.media_type}-${item.id}`}
            src={item.poster_path || ""}
            title={item.title}
            vote_average={item.vote_average}
            year={item.release_date}
          />
        ))}
      </div>
    </section>
  );
}
