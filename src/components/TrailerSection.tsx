"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useSWRImmutable from "swr/immutable";
import { TMDB_IMAGE_MULTIFACES } from "@/utils";
import { fetcher } from "@/utils";

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface VideosResponse {
  id: number;
  results: Video[];
}

interface TrailerSectionProps {
  backdropPath?: string | null;
  id: number;
  type: "movie" | "tv";
}

export default function TrailerSection({
  backdropPath,
  id,
  type,
}: TrailerSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useSWRImmutable<VideosResponse>(
    `/api/${type}/${id}/videos`,
    fetcher
  );

  const trailer = data?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  const close = useCallback(() => setIsOpen(false), []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  if (!trailer) {
    return null;
  }

  return (
    <>
      {/* Play button */}
      <button
        className="group flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
        Ver trailer
      </button>

      {/* Cinematic modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={close}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            onClick={close}
            type="button"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Video container */}
          <div
            className="relative w-full max-w-5xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Backdrop glow behind video */}
            {backdropPath && (
              <div className="absolute -inset-8 -z-10 opacity-30 blur-3xl">
                <Image
                  alt=""
                  className="object-cover"
                  fill
                  sizes="100vw"
                  src={`${TMDB_IMAGE_MULTIFACES}${backdropPath}`}
                  unoptimized
                />
              </div>
            )}
            <div
              className="relative w-full overflow-hidden rounded-xl shadow-2xl"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
                title={trailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
