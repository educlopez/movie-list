"use client";

import Image from "next/image";
import type { TMDBWatchProvider } from "@/types";

const TMDB_LOGO_BASE = "https://image.tmdb.org/t/p/original";

interface ProviderLogoProps {
  isUserPlatform: boolean;
  provider: TMDBWatchProvider;
}

export default function ProviderLogo({
  provider,
  isUserPlatform,
}: ProviderLogoProps) {
  return (
    <div
      className={`flex flex-col items-center gap-1 rounded-xl p-2 ${isUserPlatform ? "bg-emerald-500/10 ring-2 ring-emerald-500" : "bg-zinc-100 dark:bg-zinc-800"}`}
    >
      <Image
        alt={provider.provider_name}
        className="rounded-lg"
        height={48}
        src={`${TMDB_LOGO_BASE}${provider.logo_path}`}
        unoptimized
        width={48}
      />
      <span className="max-w-[60px] truncate text-center text-[10px] text-zinc-600 dark:text-zinc-400">
        {provider.provider_name}
      </span>
      {isUserPlatform && (
        <span className="font-semibold text-[9px] text-emerald-600 dark:text-emerald-400">
          tuya
        </span>
      )}
    </div>
  );
}
