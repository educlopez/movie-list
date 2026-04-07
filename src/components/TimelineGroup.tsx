"use client";

import Image from "next/image";
import type { JWProviderResults } from "@/types/tmdb";
import MovieCard from "./MovieCard";

const JW_IMAGE_BASE = "https://images.justwatch.com";

interface TimelineGroupProps {
  date: string;
  isLast?: boolean;
  label: string;
  providerGroups: JWProviderResults[];
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
          {providerGroups.map((pg) => {
            const iconUrl = pg.icon
              ? pg.icon.startsWith("http")
                ? pg.icon
                : `${JW_IMAGE_BASE}${pg.icon}`
              : "";
            return (
              <div key={pg.shortName}>
                <div className="mb-2 flex items-center gap-2">
                  {iconUrl ? (
                    <Image
                      alt={pg.clearName}
                      className="rounded"
                      height={24}
                      src={iconUrl}
                      unoptimized
                      width={24}
                    />
                  ) : null}
                  <span className="font-medium text-sm text-zinc-700 dark:text-zinc-300">
                    {pg.clearName}
                  </span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    {pg.items.length}{" "}
                    {pg.items.length === 1 ? "title" : "titles"}
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
