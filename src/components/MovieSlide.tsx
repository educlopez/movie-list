"use client";

import { FilmIcon, MonitorIcon } from "@iconicicons/react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ReactNode, SyntheticEvent } from "react";
import { FADE_IN_ANIMATION_CARD_HOVER } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { TMDB_IMAGE_MULTIFACES } from "@/utils";

export interface MovieSlideProps {
  backdrop_path: string | null;
  category: string;
  className?: string;
  first_air_date?: string;
  id: number;
  poster_path: string | null;
  release_date?: string;
  title: string;
}

export function MovieSlide({
  id,
  category,
  poster_path,
  backdrop_path,
  title,
  release_date,
  first_air_date,
  className,
}: MovieSlideProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/${category}/${id}`);
  };

  const imageSrc = poster_path
    ? `${TMDB_IMAGE_MULTIFACES}${poster_path}`
    : backdrop_path
      ? `${TMDB_IMAGE_MULTIFACES}${backdrop_path}`
      : "/placeholder-image.jpg";

  const year = release_date || first_air_date || "N/A";

  return (
    <motion.div
      className={cn("relative aspect-[2/3] w-full cursor-pointer", className)}
      onClick={handleClick}
      {...FADE_IN_ANIMATION_CARD_HOVER}
    >
      <Image
        alt={title}
        className="rounded-lg object-cover"
        fill
        onError={(e: SyntheticEvent<HTMLImageElement>) => {
          const target = e.currentTarget;
          target.onerror = null;
          target.src = "/placeholder-image.jpg";
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        src={imageSrc}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-end rounded-lg bg-gradient-to-t from-black to-transparent p-4">
        <h3 className="line-clamp-2 text-center font-bold text-lg text-white">
          {title}
        </h3>
        <p className="text-center text-sm text-zinc-300">{renderYear(year)}</p>
        <div className="mt-2 flex items-center text-zinc-300">
          {renderCategoryIcon(category)}
          <span className="ml-2 text-xs">{renderCategoryText(category)}</span>
        </div>
      </div>
    </motion.div>
  );
}

function renderYear(year: string): string {
  return year && typeof year === "string" ? year.slice(0, 4) : "N/A";
}

function renderCategoryIcon(category: string): ReactNode {
  return category === "movie" ? (
    <FilmIcon className="h-4 w-4" />
  ) : (
    <MonitorIcon className="h-4 w-4" />
  );
}

function renderCategoryText(category: string): string {
  return category === "movie" ? "Movie" : "TV Show";
}
