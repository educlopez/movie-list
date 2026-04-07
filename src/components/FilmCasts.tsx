"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useDragScroll } from "@/hooks/useDragScroll";
import type { TMDBCastMember } from "@/types";
import { shimmer, TMDB_IMAGE_CAST_ENDPOINT, toBase64 } from "@/utils";

interface FilmCastsProps {
  casts: TMDBCastMember[];
}

export default function FilmCasts({ casts }: FilmCastsProps) {
  const scrollRef = useDragScroll<HTMLUListElement>();

  return (
    <div className="mb-10 w-full text-zinc-900 dark:text-white">
      <h3 className="mb-2 md:text-lg">Top Billed Cast</h3>
      <ul
        className="scrollbar-none relative flex touch-pan-y select-none gap-x-4 overflow-x-auto pb-2 text-xs md:text-sm"
        ref={scrollRef}
      >
        {renderCasts(casts)}
      </ul>
    </div>
  );
}

function renderCasts(arr: TMDBCastMember[]): ReactNode {
  if (Array.isArray(arr) && arr.length !== 0) {
    return arr.map((cast) => {
      return (
        <li
          className="flex-none rounded-2xl border border-zinc-900/10 bg-white/10 backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/20 dark:backdrop-blur"
          key={cast.credit_id}
        >
          <div className="flex w-full flex-col items-center justify-center gap-3 pb-2">
            {cast.profile_path ? (
              <Image
                alt={cast.name}
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer(350, 530)
                )}`}
                className="pointer-events-none rounded-lg"
                draggable={false}
                height={225}
                placeholder="blur"
                src={`${TMDB_IMAGE_CAST_ENDPOINT}${cast.profile_path}`}
                unoptimized
                width={150}
              />
            ) : (
              <div className="flex h-[225px] w-[150px] items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800">
                <svg
                  className="h-12 w-12 text-zinc-400 dark:text-zinc-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            <span className="mx-auto px-2 text-center text-xs lg:text-sm dark:text-white">
              <p className="font-bold">{cast.name}</p>
              <p className="w-32 truncate">{cast.character}</p>
            </span>
          </div>
        </li>
      );
    });
  }
  return "N/A";
}
