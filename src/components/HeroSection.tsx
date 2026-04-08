"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import type { TrendingResponse } from "@/types/tmdb";
import { fetcher, TMDB_IMAGE_MULTIFACES } from "@/utils";
import RatingBadge from "./RatingBadge";

const AUTOPLAY_INTERVAL = 6000;

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  const { data } = useSWR<TrendingResponse>(
    "/api/trending?type=all&time=day",
    fetcher
  );

  const itemCount = data?.results?.length
    ? Math.min(data.results.length, 5)
    : 0;

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % itemCount);
  }, [itemCount]);

  useEffect(() => {
    if (itemCount <= 1 || isPaused) {
      return;
    }
    timerRef.current = setInterval(goToNext, AUTOPLAY_INTERVAL);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [itemCount, isPaused, goToNext]);

  if (!data || itemCount === 0) {
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
      aria-label="Tendencias"
      className="relative overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Backdrop */}
      <div className="relative h-[400px] w-full sm:h-[450px] lg:h-[500px]">
        <Image
          alt={title}
          className="object-cover transition-opacity duration-700"
          fill
          key={item.id}
          priority
          sizes="100vw"
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
            {mediaType === "tv" ? "Serie" : "Película"}
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

        {/* Progress indicators */}
        <div className="mt-6 flex items-center gap-2">
          {items.map((_, i) => {
            const isActive = i === activeIndex;
            return (
              <motion.button
                animate={{
                  width: isActive ? 48 : 6,
                  height: isActive ? 4 : 6,
                  opacity: isActive ? 1 : 0.5,
                }}
                aria-label={`Show trending item ${(i + 1).toString()}`}
                className="relative overflow-hidden rounded-full bg-white/25"
                key={`bar-${items[i].id.toString()}`}
                layout
                onClick={() => {
                  setActiveIndex(i);
                  if (timerRef.current) {
                    clearInterval(timerRef.current);
                  }
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                type="button"
                whileHover={{ opacity: 1 }}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      animate={{ width: "100%" }}
                      className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
                      exit={{ opacity: 0 }}
                      initial={{ width: 0 }}
                      key={`fill-${activeIndex}`}
                      transition={{
                        width: {
                          duration: isPaused ? 0 : AUTOPLAY_INTERVAL / 1000,
                          ease: "linear",
                        },
                        opacity: { duration: 0.2 },
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
