"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import type { DiscoverItem, DiscoverResponse } from "@/types/tmdb";
import { fetcher } from "@/utils";
import CardSkeleton from "./CardSkeleton";
import FilterBar from "./FilterBar";
import TimelineGroup from "./TimelineGroup";

type MediaType = "all" | "movie" | "tv";
type Mode = "new" | "upcoming";

function groupByDate(items: DiscoverItem[]) {
  const groups: Record<string, DiscoverItem[]> = {};
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000)
    .toISOString()
    .slice(0, 10);

  for (const item of items) {
    const date = item.release_date?.slice(0, 10) || "Unknown";
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
  }

  const sorted = Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));

  return sorted.map(([date, dateItems]) => {
    let label = date;
    if (date === today) {
      label = "Today";
    } else if (date === yesterday) {
      label = "Yesterday";
    } else {
      const d = new Date(date + "T00:00:00");
      label = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return { date, label, items: dateItems };
  });
}

export default function NewPageContent() {
  const [mediaType, setMediaType] = useState<MediaType>("all");
  const [mode, setMode] = useState<Mode>("new");
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    rating: "",
  });
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<DiscoverResponse["results"]>([]);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const params = new URLSearchParams({
    type: mediaType,
    mode,
    page: page.toString(),
    ...(filters.genre && { genre: filters.genre }),
    ...(filters.year && { year: filters.year }),
    ...(filters.rating && { rating: filters.rating }),
  });

  const { data, error, isLoading } = useSWR<DiscoverResponse>(
    `/api/discover?${params.toString()}`,
    fetcher
  );

  useEffect(() => {
    if (data?.results) {
      if (page === 1) {
        setAllItems(data.results);
      } else {
        setAllItems((prev) => [...prev, ...data.results]);
      }
      setHasMore(data.page < data.total_pages);
    }
  }, [data, page]);

  useEffect(() => {
    setPage(1);
    setAllItems([]);
    setHasMore(true);
  }, [mediaType, mode, filters]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((p) => p + 1);
    }
  }, [isLoading, hasMore]);

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

  const groups = groupByDate(allItems);

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
      {/* Type tabs */}
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

      {/* Sub-tabs + Filters */}
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

      {/* Timeline */}
      {allItems.length === 0 && isLoading && (
        <div className="space-y-8">
          <CardSkeleton count={8} />
          <CardSkeleton count={8} />
        </div>
      )}

      {error && (
        <div
          className="rounded-lg bg-red-50 p-4 text-red-600 text-sm dark:bg-red-900/20 dark:text-red-400"
          role="alert"
        >
          Could not load results. Please try again later.
        </div>
      )}

      {groups.map((group, i) => (
        <TimelineGroup
          date={group.date}
          isLast={i === groups.length - 1 && !hasMore}
          items={group.items}
          key={group.date}
          label={group.label}
        />
      ))}

      {allItems.length > 0 && !hasMore && (
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          No more results
        </p>
      )}

      {/* Infinite scroll sentinel */}
      <div className="h-1" ref={sentinelRef} />

      {isLoading && allItems.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      )}
    </div>
  );
}
