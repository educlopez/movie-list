"use client";

import Image from "next/image";
import type { ProviderResults } from "@/types/tmdb";
import MovieCard from "./MovieCard";

const TMDB_LOGO_BASE = "https://image.tmdb.org/t/p/original";

interface TimelineGroupProps {
  date: string;
  isLast?: boolean;
  label: string;
  providerGroups: ProviderResults[];
  totalItems: number;
}

export default function TimelineGroup({
  label,
  providerGroups,
  totalItems,
  isLast = false,
}: TimelineGroupProps) {
  return (
    <div className="relative pl-8">
      {!isLast && (
        <div className="absolute top-3 bottom-0 left-[7px] w-px bg-zinc-200 dark:bg-zinc-700" />
      )}
      <div className="absolute top-1 left-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-emerald-500 bg-white dark:bg-zinc-900">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </div>

      <div className="pb-8">
        <div className="mb-4 flex items-baseline gap-2">
          <h3 className="font-semibold text-zinc-900 dark:text-white">
            {label}
          </h3>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {totalItems} {totalItems === 1 ? "title" : "titles"}
          </span>
        </div>

        <div className="space-y-6">
          {providerGroups.map((pg) => (
            <div key={pg.provider_id}>
              <div className="mb-2 flex items-center gap-2">
                {pg.logo_path ? (
                  <Image
                    alt={pg.provider_name}
                    className="rounded"
                    height={24}
                    src={`${TMDB_LOGO_BASE}${pg.logo_path}`}
                    unoptimized
                    width={24}
                  />
                ) : null}
                <span className="font-medium text-sm text-zinc-700 dark:text-zinc-300">
                  {pg.provider_name}
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  {pg.items.length} {pg.items.length === 1 ? "title" : "titles"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8">
                {pg.items.map((item) => (
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
