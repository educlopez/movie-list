"use client";

import { use } from "react";
import useSWR from "swr";

import FilmCasts from "@/components/FilmCasts";
import FilmGenres from "@/components/FilmGenres";
import FilmHeading from "@/components/FilmHeading";
import FilmImage from "@/components/FilmImage";
import FilmInfo from "@/components/FilmInfo";
import FilmSynopsis from "@/components/FilmSynopsis";
import Loading from "@/components/Loading";
import WatchProviders from "@/components/WatchProviders";
import type { MovieDetailResponse } from "@/types";
import { fetcher } from "@/utils";
import { renderLanguage, renderStatus } from "@/utils/media";

export default function Movie({
  params,
}: {
  params: Promise<{ id: string }>;
}): React.JSX.Element {
  const { id } = use(params);

  const { data: movie, error: movieError } = useSWR<MovieDetailResponse>(
    `/api/movie/${id}`,
    fetcher
  );

  if (movieError) {
    return <div>{movieError}</div>;
  }
  if (!movie) {
    return <div>{movieError}</div>;
  }

  return (
    <>
      {movie ? (
        <>
          <div className="flex flex-col sm:mx-8 md:mx-0 md:flex-row md:items-start lg:justify-center">
            <FilmImage
              src={movie.detail.poster_path}
              title={movie.detail.title}
            />

            <div className="md:w-3/5">
              <FilmHeading
                tagline={movie.detail.tagline}
                title={movie.detail.title}
              />
              <FilmInfo
                language={renderLanguage(movie.detail.spoken_languages || [])}
                length={renderLength(movie.detail.runtime)}
                media_type="movie"
                status={renderStatus(movie.detail.status)}
                year={renderYear(movie.detail.release_date)}
              />
              <FilmGenres genres={movie.detail.genres || []} />
              <FilmSynopsis synopsis={movie.detail.overview} />
              <WatchProviders id={movie.detail.id} type="movie" />
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:mx-8 md:mx-0 md:flex-row md:items-start lg:justify-center">
            <FilmCasts casts={movie.credits.cast} />
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}

function renderLength(runtime: number | undefined): string {
  if (runtime !== 0 && runtime !== undefined) {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    if (hours < 1) {
      return `${minutes}min`;
    }
    return `${hours}h ${minutes}min`;
  }
  return "N/A";
}

function renderYear(year: string | undefined): string {
  if (!year) {
    return "N/A";
  }
  return year.slice(0, 4);
}
