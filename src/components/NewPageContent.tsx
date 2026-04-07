"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePreferences } from "@/stores/preferences";
import type { DayDiscoverResponse } from "@/types/tmdb";
import CardSkeleton from "./CardSkeleton";
import FilterBar from "./FilterBar";
import TimelineGroup from "./TimelineGroup";

type MediaType = "all" | "movie" | "tv";
type Mode = "new" | "upcoming";

function getDateLabel(dateStr: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000)
    .toISOString()
    .slice(0, 10);
  if (dateStr === today) {
    return "Today";
  }
  if (dateStr === yesterday) {
    return "Yesterday";
  }
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDateOffset(baseDate: Date, offset: number): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export default function NewPageContent() {
  const [mediaType, setMediaType] = useState<MediaType>("all");
  const [mode, setMode] = useState<Mode>("new");
  const [filters, setFilters] = useState({ genre: "", year: "", rating: "" });
  const [days, setDays] = useState<DayDiscoverResponse[]>([]);
  const [dayOffset, setDayOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { country, platforms } = usePreferences();

  const fetchDay = useCallback(
    async (offset: number) => {
      const date =
        mode === "new"
          ? getDateOffset(new Date(), -offset)
          : getDateOffset(new Date(), offset + 1);

      const params = new URLSearchParams({
        type: mediaType,
        mode,
        date,
        country,
        ...(platforms.length > 0 && { providers: platforms.join(",") }),
        ...(filters.genre && { genre: filters.genre }),
        ...(filters.rating && { rating: filters.rating }),
      });

      const res = await fetch(`/api/discover?${params.toString()}`);
      const data: DayDiscoverResponse = await res.json();
      return data;
    },
    [mediaType, mode, country, platforms, filters]
  );

  // Load initial 3 days
  useEffect(() => {
    let cancelled = false;
    setDays([]);
    setDayOffset(0);
    setHasMore(true);
    setIsLoading(true);

    (async () => {
      const results: DayDiscoverResponse[] = [];
      for (let i = 0; i < 3; i++) {
        const day = await fetchDay(i);
        if (cancelled) {
          return;
        }
        if (day.providers.length > 0) {
          results.push(day);
        }
      }
      setDays(results);
      setDayOffset(3);
      setIsLoading(false);
      if (results.length === 0) {
        setHasMore(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchDay]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) {
      return;
    }
    setIsLoading(true);

    // Load next day (skip empty days, try up to 5)
    let found = false;
    let offset = dayOffset;
    for (let attempt = 0; attempt < 5; attempt++) {
      const day = await fetchDay(offset);
      offset++;
      if (day.providers.length > 0) {
        setDays((prev) => [...prev, day]);
        found = true;
        break;
      }
    }

    setDayOffset(offset);
    if (!found || offset > 30) {
      setHasMore(false);
    }
    setIsLoading(false);
  }, [isLoading, hasMore, dayOffset, fetchDay]);

  // Infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const tabClass = (active: boolean) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      active
        ? "bg-emerald-500 text-white"
        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
    }`;

  const subTabClass = (active: boolean) =>
    `px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
      active
        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
        : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
    }`;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(["all", "movie", "tv"] as const).map((t) => (
          <button
            className={tabClass(mediaType === t)}
            key={t}
            onClick={() => setMediaType(t)}
            type="button"
          >
            {t === "all" ? "All" : t === "movie" ? "Movies" : "TV Shows"}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <button
            className={subTabClass(mode === "new")}
            onClick={() => setMode("new")}
            type="button"
          >
            New releases
          </button>
          <button
            className={subTabClass(mode === "upcoming")}
            onClick={() => setMode("upcoming")}
            type="button"
          >
            Upcoming
          </button>
        </div>
        <FilterBar filters={filters} onFilterChange={setFilters} />
      </div>

      {days.length === 0 && isLoading && (
        <div className="space-y-8">
          <CardSkeleton count={8} />
          <CardSkeleton count={8} />
        </div>
      )}

      {days.map((day, i) => {
        const totalItems = day.providers.reduce(
          (sum, pg) => sum + pg.items.length,
          0
        );
        return (
          <TimelineGroup
            date={day.date}
            isLast={i === days.length - 1 && !hasMore}
            key={day.date}
            label={getDateLabel(day.date)}
            providerGroups={day.providers}
            totalItems={totalItems}
          />
        );
      })}

      {days.length > 0 && !hasMore && (
        <p className="pl-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          No more results
        </p>
      )}

      <div className="h-1" ref={sentinelRef} />

      {isLoading && days.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      )}
    </div>
  );
}
