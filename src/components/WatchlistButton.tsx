"use client";

import { useAuthWatchlist } from "@/hooks/useAuthWatchlist";

interface WatchlistButtonProps {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string;
}

export default function WatchlistButton({
  id,
  media_type,
  title,
  poster_path,
}: WatchlistButtonProps) {
  const { isInWatchlist, toggleItem } = useAuthWatchlist();
  const inList = isInWatchlist(id, media_type);

  return (
    <button
      aria-label={inList ? "Remove from watchlist" : "Add to watchlist"}
      className="group/btn inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
      onClick={() => toggleItem({ id, media_type, title, poster_path })}
      type="button"
    >
      <svg
        className={`h-4 w-4 transition-colors ${
          inList
            ? "fill-amber-500 text-amber-500"
            : "fill-none text-zinc-500 group-hover/btn:text-zinc-700 dark:text-zinc-400 dark:group-hover/btn:text-zinc-200"
        }`}
        fill="currentFill"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={`${
          inList
            ? "text-amber-600 dark:text-amber-400"
            : "text-zinc-600 dark:text-zinc-400"
        }`}
      >
        {inList ? "In Watchlist" : "Watchlist"}
      </span>
    </button>
  );
}
