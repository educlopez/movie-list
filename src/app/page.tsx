"use client";

import { useMemo, useState } from "react";
import CardRow from "@/components/CardRow";
import type { CardRowFilters } from "@/components/CardRow";
import FilterBar from "@/components/FilterBar";
import GenreFilter from "@/components/GenreFilter";
import HeroSection from "@/components/HeroSection";
import TrendingToggle from "@/components/TrendingToggle";

export default function Home() {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [trendingTime, setTrendingTime] = useState<"day" | "week">("day");

  const filters: CardRowFilters = useMemo(
    () => ({
      genre: selectedGenre,
      rating: selectedRating,
      year: selectedYear,
    }),
    [selectedGenre, selectedRating, selectedYear]
  );

  const hasActiveFilters =
    selectedGenre !== null ||
    selectedYear !== null ||
    selectedRating !== null;

  return (
    <div className="space-y-8">
      <HeroSection />

      <div className="space-y-3">
        <GenreFilter
          onSelectGenre={setSelectedGenre}
          selectedGenre={selectedGenre}
        />
        <FilterBar
          onRatingChange={setSelectedRating}
          onYearChange={setSelectedYear}
          selectedRating={selectedRating}
          selectedYear={selectedYear}
        />
      </div>

      {/* Trending */}
      <section>
        <div className="mb-3 flex items-center gap-4">
          <h2 className="font-semibold text-lg text-zinc-900 dark:text-white">
            Tendencias
          </h2>
          <TrendingToggle
            onChange={setTrendingTime}
            timeWindow={trendingTime}
          />
        </div>
        <CardRow
          endpoint={`/api/trending?type=movie&time=${trendingTime}`}
          filters={filters}
          hideTitle
          mediaType="movie"
          seeMoreHref="/movie/popular/1"
          title="Tendencias"
        />
      </section>

      <CardRow
        endpoint="/api/movie/upcoming/1"
        filters={filters}
        mediaType="movie"
        seeMoreHref="/movie/now/1"
        title="Próximamente"
      />

      <CardRow
        endpoint="/api/movie/now/1"
        filters={filters}
        mediaType="movie"
        seeMoreHref="/movie/now/1"
        title="En cartelera"
      />

      <CardRow
        endpoint="/api/movie/popular/1"
        filters={filters}
        mediaType="movie"
        seeMoreHref="/movie/popular/1"
        title="Películas populares"
      />

      <CardRow
        endpoint="/api/tv/airing-today/1"
        filters={filters}
        mediaType="tv"
        seeMoreHref="/tv/airing-today/1"
        title="En emisión hoy"
      />

      <CardRow
        endpoint="/api/tv/popular/1"
        filters={filters}
        mediaType="tv"
        seeMoreHref="/tv/popular/1"
        title="Series populares"
      />
    </div>
  );
}
