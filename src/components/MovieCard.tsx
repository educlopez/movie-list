"use client";

import { FilmIcon, MonitorIcon } from "@iconicicons/react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { FADE_IN_ANIMATION_CARD_HOVER } from "@/lib/constants";
import { TMDB_IMAGE_THUMB_ENDPOINT } from "@/utils";

interface MovieCardProps {
  category: string;
  id: number;
  rating?: boolean;
  src: string;
  title: string;
  year?: string;
}

export default function MovieCard({
  id,
  category,
  src,
  title,
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
      {...FADE_IN_ANIMATION_CARD_HOVER}
    >
      <div onClick={handleClick}>
        <Image
          alt={title}
          className="w-full rounded-md"
          height={330}
          src={
            src === "null"
              ? "https://placehold.co/150x225"
              : `${TMDB_IMAGE_THUMB_ENDPOINT}${src}`
          }
          unoptimized
          width={220}
        />
        <p className="mt-1 text-center text-zinc-600 dark:text-zinc-400">
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
  return "TV Shows";
}
