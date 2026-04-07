"use client";

import Image from "next/image";
import type { TMDBAvailablePlatform } from "@/types/providers";

const TMDB_LOGO_BASE = "https://image.tmdb.org/t/p/original";

interface PlatformGridProps {
  onToggle: (id: number) => void;
  platforms: TMDBAvailablePlatform[];
  selected: number[];
}

export default function PlatformGrid({
  platforms,
  selected,
  onToggle,
}: PlatformGridProps) {
  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
      {platforms.map((platform) => {
        const isSelected = selected.includes(platform.provider_id);
        return (
          <button
            className={`flex flex-col items-center gap-1 rounded-xl p-2 transition-all ${
              isSelected
                ? "bg-emerald-500/10 ring-2 ring-emerald-500"
                : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            }`}
            key={platform.provider_id}
            onClick={() => onToggle(platform.provider_id)}
            type="button"
          >
            <Image
              alt={platform.provider_name}
              className="rounded-lg"
              height={40}
              src={`${TMDB_LOGO_BASE}${platform.logo_path}`}
              unoptimized
              width={40}
            />
            <span className="max-w-[56px] truncate text-center text-[9px] text-zinc-600 dark:text-zinc-400">
              {platform.provider_name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
