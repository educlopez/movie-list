"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { authClient } from "@/lib/auth-client";
import { fetcher } from "@/utils";

interface AlertDbItem {
  id: number;
  userId: string;
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string;
  createdAt: string;
}

interface AlertButtonProps {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string;
  isAvailableOnMyPlatforms: boolean;
}

export default function AlertButton({
  id,
  media_type,
  title,
  poster_path,
  isAvailableOnMyPlatforms,
}: AlertButtonProps) {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;

  const { data: alerts, mutate } = useSWR<AlertDbItem[]>(
    isLoggedIn ? "/api/alerts" : null,
    fetcher
  );

  const isTracking = (alerts ?? []).some(
    (a) => a.tmdbId === id && a.mediaType === media_type
  );

  const handleToggle = useCallback(async () => {
    if (isTracking) {
      await fetch("/api/alerts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tmdbId: id, mediaType: media_type }),
      });
    } else {
      await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId: id,
          mediaType: media_type,
          title,
          posterPath: poster_path,
        }),
      });
    }
    mutate();
  }, [isTracking, id, media_type, title, poster_path, mutate]);

  // Only show for logged-in users when NOT available on their platforms
  if (!isLoggedIn || isAvailableOnMyPlatforms) {
    return null;
  }

  return (
    <button
      aria-label={isTracking ? "Dejar de seguir" : "Avisarme cuando este disponible"}
      className={`group/alert inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
        isTracking
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
      }`}
      onClick={handleToggle}
      type="button"
    >
      {isTracking ? (
        <svg
          className="h-4 w-4 text-emerald-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4 text-zinc-500 group-hover/alert:text-zinc-700 dark:text-zinc-400 dark:group-hover/alert:text-zinc-200"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <span
        className={
          isTracking
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-zinc-600 dark:text-zinc-400"
        }
      >
        {isTracking ? "Siguiendo" : "Avisarme"}
      </span>
    </button>
  );
}
