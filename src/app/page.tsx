"use client";

import { useState } from "react";
import CardRow from "@/components/CardRow";
import GenreFilter from "@/components/GenreFilter";
import HeroSection from "@/components/HeroSection";
import TrendingToggle from "@/components/TrendingToggle";

export default function Home() {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [trendingTime, setTrendingTime] = useState<"day" | "week">("day");

  return (
    <div className="space-y-8">
      <HeroSection />

      <GenreFilter
        onSelectGenre={setSelectedGenre}
        selectedGenre={selectedGenre}
      />

      {/* Trending */}
      <section>
        <div className="mb-3 flex items-center gap-4">
          <h2 className="font-semibold text-lg text-zinc-900 dark:text-white">
            Trending
          </h2>
          <TrendingToggle
            onChange={setTrendingTime}
            timeWindow={trendingTime}
          />
        </div>
        <CardRow
          endpoint={`/api/trending?type=movie&time=${trendingTime}`}
          hideTitle
          mediaType="movie"
          seeMoreHref="/movie/popular/1"
          title="Trending"
        />
      </section>

      <CardRow
        endpoint="/api/movie/upcoming/1"
        mediaType="movie"
        seeMoreHref="/movie/now/1"
        title="Upcoming"
      />

      <CardRow
        endpoint="/api/movie/now/1"
        mediaType="movie"
        seeMoreHref="/movie/now/1"
        title="Now Playing"
      />

      <CardRow
        endpoint="/api/movie/popular/1"
        mediaType="movie"
        seeMoreHref="/movie/popular/1"
        title="Popular Movies"
      />

      <CardRow
        endpoint="/api/tv/airing-today/1"
        mediaType="tv"
        seeMoreHref="/tv/airing-today/1"
        title="Airing Today"
      />

      <CardRow
        endpoint="/api/tv/popular/1"
        mediaType="tv"
        seeMoreHref="/tv/popular/1"
        title="Popular TV"
      />
    </div>
  );
}
