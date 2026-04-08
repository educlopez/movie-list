"use client";

import { FilmIcon, MonitorIcon } from "@iconicicons/react";
import { motion } from "motion/react";
import Image from "next/image";
import { memo, useState } from "react";
import { useRouter } from "next/navigation";
import { TMDB_IMAGE_THUMB_ENDPOINT } from "@/utils";
import { useWatchlist } from "@/stores/watchlist";
import RatingBadge from "./RatingBadge";

interface MovieCardProps {
  category: string;
  id: number;
  rating?: boolean;
  src: string;
  title: string;
  vote_average?: number;
  year?: string;
}

export default memo(function MovieCard({
  id,
  category,
  src,
  title,
  vote_average,
  year,
}: MovieCardProps) {
  const router = useRouter();
  const { isInWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(id, category as "movie" | "tv");

  const handleClick = () => {
    if (category === "movie") {
      router.push(`/movie/${id}`);
    } else if (category === "tv") {
      router.push(`/tv/${id}`);
    }
  };

  const [imageLoaded, setImageLoaded] = useState(false);
  const yearText = year ? year.slice(0, 4) : "";

  return (
    <motion.li
      className="group relative flex cursor-pointer flex-col items-start"
      transition={{ duration: 0.15 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <div onClick={handleClick}>
        <div className="relative">
          <div
            className={`overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800 ${
              !imageLoaded ? "animate-pulse" : ""
            }`}
          >
            <Image
              alt={title}
              className={`pointer-events-none rounded-lg transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              draggable={false}
              height={225}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 150px"
              src={
                src === "null" || src === ""
                  ? "https://placehold.co/150x225"
                  : src.startsWith("poster/") || src.startsWith("/poster/")
                    ? `https://images.justwatch.com${src.startsWith("/") ? "" : "/"}${src.replace("{profile}", "s166")}`
                    : `${TMDB_IMAGE_THUMB_ENDPOINT}${src}`
              }
              unoptimized
              width={150}
            />
          </div>
          {/* Rating badge — top right */}
          {vote_average !== undefined && vote_average > 0 && (
            <div className="absolute top-1.5 right-1.5">
              <RatingBadge rating={vote_average} />
            </div>
          )}
          {/* Watchlist indicator — bottom right */}
          {inWatchlist && (
            <div className="absolute right-1.5 bottom-1.5 flex items-center rounded-md bg-amber-500/90 p-1 backdrop-blur-sm">
              <svg
                className="h-3 w-3 fill-white text-white"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
          {/* Category badge — top left */}
          <div className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 backdrop-blur-sm">
            {category === "movie" ? (
              <FilmIcon className="h-3 w-3 text-white" />
            ) : (
              <MonitorIcon className="h-3 w-3 text-white" />
            )}
            <span className="font-medium text-[10px] text-white">
              {category === "movie" ? "Movie" : "TV"}
            </span>
          </div>
        </div>
        <p className="mt-1.5 line-clamp-2 font-medium text-sm text-zinc-800 dark:text-zinc-200">
          {title}
        </p>
        {yearText && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{yearText}</p>
        )}
      </div>
    </motion.li>
  );
});
