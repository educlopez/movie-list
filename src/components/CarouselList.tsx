"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@iconicicons/react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { type ComponentType, useState } from "react";
import useSWR from "swr";
import Loading from "@/components/Loading";
import { MovieSlide, type MovieSlideProps } from "@/components/MovieSlide";
import { fetcher } from "@/utils";

interface Movie {
  backdrop_path: string | null;
  first_air_date?: string;
  id: number;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  title?: string;
  [key: string]: unknown;
}

interface CarouselListProps {
  Component?: ComponentType<MovieSlideProps>;
  endpoint: string;
  href?: string;
  isHomePage?: boolean;
  limit?: number;
  media_type?: string;
  title?: string;
}

export default function CarouselList({
  Component = MovieSlide,
  endpoint,
  media_type = "movie",
}: CarouselListProps) {
  const { data, error } = useSWR<{ results: Movie[] }>(endpoint, fetcher);
  const [index, setIndex] = useState(0);

  if (error) {
    return <div>Error occurred</div>;
  }
  if (!data) {
    return <Loading />;
  }

  const movies = data.results || [];
  const totalSlides = movies.length;

  const handlePrev = () =>
    setIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  const handleNext = () =>
    setIndex((prevIndex) =>
      prevIndex < totalSlides - 1 ? prevIndex + 1 : prevIndex
    );

  return (
    <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
      <div className="h-96 overflow-hidden bg-black">
        <div className="relative mx-auto flex h-full max-w-full justify-center">
          <motion.div
            animate={{ x: `-${index * 100}%` }}
            className="flex w-full"
          >
            {movies.map((movie) => (
              <div className="w-full flex-shrink-0" key={movie.id}>
                <Component
                  backdrop_path={movie.backdrop_path}
                  category={media_type}
                  className="aspect-[2/1]"
                  first_air_date={movie.first_air_date}
                  id={movie.id}
                  poster_path={movie.backdrop_path}
                  release_date={movie.release_date}
                  title={movie.title || movie.name || ""}
                />
              </div>
            ))}
          </motion.div>

          <AnimatePresence initial={false}>
            {index > 0 && (
              <motion.button
                animate={{ opacity: 0.7 }}
                className="absolute top-1/2 left-2 z-10 -mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-white"
                exit={{ opacity: 0, pointerEvents: "none" }}
                initial={{ opacity: 0 }}
                onClick={handlePrev}
                whileHover={{ opacity: 1 }}
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {index < totalSlides - 1 && (
              <motion.button
                animate={{ opacity: 0.7 }}
                className="absolute top-1/2 right-2 z-10 -mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-white"
                exit={{ opacity: 0, pointerEvents: "none" }}
                initial={{ opacity: 0 }}
                onClick={handleNext}
                whileHover={{ opacity: 1 }}
              >
                <ChevronRightIcon className="h-6 w-6" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
