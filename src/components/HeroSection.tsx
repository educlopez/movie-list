"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import type { TrendingResponse } from "@/types";
import { fetcher, TMDB_IMAGE_MULTIFACES } from "@/utils";
import RatingBadge from "./RatingBadge";

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data } = useSWR<TrendingResponse>(
    "/api/trending?type=all&time=day",
    fetcher
  );

  if (!data || data.results.length === 0) {
    return (
      <div className="relative h-[400px] w-full animate-pulse rounded-2xl bg-zinc-200 sm:h-[450px] lg:h-[500px] dark:bg-zinc-800" />
    );
  }

  const items = data.results.slice(0, 5);
  const item = items[activeIndex];
  const title = item.title || item.original_name || item.original_title || "";
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const mediaType = item.media_type || "movie";
  const detailUrl = `/${mediaType}/${item.id}`;

  return (
    <section
      aria-label="Trending now"
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Backdrop */}
      <div className="relative h-[400px] w-full sm:h-[450px] lg:h-[500px]">
        <Image
          alt={title}
          className="object-cover"
          fill
          priority
          src={`${TMDB_IMAGE_MULTIFACES}${item.backdrop_path}`}
          unoptimized
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute right-0 bottom-0 left-0 p-6 sm:p-8 lg:p-12">
        <div className="mb-2 flex items-center gap-3">
          <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 font-medium text-emerald-400 text-xs">
            {mediaType === "tv" ? "TV Show" : "Movie"}
          </span>
          {year && <span className="text-sm text-zinc-300">{year}</span>}
        </div>

        <h1 className="mb-2 line-clamp-2 font-bold text-2xl text-white sm:text-3xl lg:text-4xl">
          {title}
        </h1>

        {item.overview && (
          <p className="mb-4 line-clamp-2 max-w-2xl text-sm text-zinc-300 sm:text-base">
            {item.overview}
          </p>
        )}

        <div className="flex items-center gap-4">
          {item.vote_average > 0 && (
            <RatingBadge rating={item.vote_average} size="md" />
          )}
          <Link
            className="rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-sm text-white transition-colors hover:bg-emerald-600"
            href={detailUrl}
          >
            Ver detalles
          </Link>
        </div>

        {/* Dots */}
        <div className="mt-6 flex gap-2">
          {items.map((_, i) => (
            <button
              aria-label={`Show trending item ${(i + 1).toString()}`}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex
                  ? "w-8 bg-emerald-500"
                  : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
              key={`dot-${items[i].id.toString()}`}
              onClick={() => setActiveIndex(i)}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
