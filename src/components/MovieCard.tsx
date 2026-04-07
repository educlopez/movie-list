"use client";

import { FilmIcon, MonitorIcon } from "@iconicicons/react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { TMDB_IMAGE_THUMB_ENDPOINT } from "@/utils";
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

export default function MovieCard({
  id,
  category,
  src,
  title,
  vote_average,
  year,
}: MovieCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (category === "movie") {
      router.push(`/movie/${id}`);
    } else if (category === "tv") {
      router.push(`/tv/${id}`);
    }
  };

  return (
    <motion.li
      className="group relative flex cursor-pointer flex-col items-start"
      transition={{ duration: 0.15 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <div onClick={handleClick}>
        <div className="relative">
          <Image
            alt={title}
            className="pointer-events-none rounded-md"
            draggable={false}
            height={225}
            src={
              src === "null"
                ? "https://placehold.co/150x225"
                : `${TMDB_IMAGE_THUMB_ENDPOINT}${src}`
            }
            unoptimized
            width={150}
          />
          {vote_average !== undefined && (
            <div className="absolute top-1 right-1">
              <RatingBadge rating={vote_average} />
            </div>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-center text-zinc-600 dark:text-zinc-400">
          {title}
        </p>
        <p className="mt-1 text-center text-zinc-600 dark:text-zinc-400">
          {renderYear(year)}
        </p>
        <p className="mt-1 flex justify-center text-zinc-600 dark:text-zinc-400">
          {renderCategoryIcon(category)}
          <span className="pr-[6px] pl-[6px]">
            {renderCategoryText(category)}
          </span>
        </p>
      </div>
    </motion.li>
  );
}

function renderYear(year: string | undefined): string {
  if (year) {
    return year.slice(0, 4);
  }
  return "N/A";
}

function renderCategoryIcon(category: string): ReactNode {
  if (category === "movie") {
    return <FilmIcon className="pl-1 text-base" />;
  }
  return <MonitorIcon className="pl-1 text-base" />;
}

function renderCategoryText(category: string): string {
  if (category === "movie") {
    return "Movie";
  }
  return "TV";
}
