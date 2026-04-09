import type { Metadata } from "next";
import Image from "next/image";

import AlertButtonWrapper from "@/components/AlertButtonWrapper";
import FilmCasts from "@/components/FilmCasts";
import Recommendations from "@/components/Recommendations";
import FilmGenres from "@/components/FilmGenres";
import FilmHeading from "@/components/FilmHeading";
import FilmInfo from "@/components/FilmInfo";
import FilmSynopsis from "@/components/FilmSynopsis";
import TrailerSection from "@/components/TrailerSection";
import WatchProviders from "@/components/WatchProviders";
import WatchlistButton from "@/components/WatchlistButton";
import { getMovieCasts, getMovieDetail } from "@/lib/tmdb";
import type { TMDBCreditsResponse, TMDBMovieDetail } from "@/types/tmdb";
import { TMDB_IMAGE_ENDPOINT } from "@/utils";
import { renderLanguage, renderStatus } from "@/utils/media";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const res = await fetch(getMovieDetail(id));
  const detail: TMDBMovieDetail = await res.json();
  const posterUrl = detail.poster_path
    ? `https://image.tmdb.org/t/p/w500${detail.poster_path}`
    : undefined;
  return {
    title: detail.title,
    description:
      detail.overview || `Información sobre la película ${detail.title}`,
    openGraph: {
      title: detail.title,
      description:
        detail.overview || `Información sobre la película ${detail.title}`,
      ...(posterUrl && {
        images: [
          { url: posterUrl, width: 500, height: 750, alt: detail.title },
        ],
      }),
    },
  };
}

export default async function Movie({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [detailRes, creditsRes] = await Promise.all([
    fetch(getMovieDetail(id)),
    fetch(getMovieCasts(id)),
  ]);
  const [detail, credits]: [TMDBMovieDetail, TMDBCreditsResponse] =
    await Promise.all([detailRes.json(), creditsRes.json()]);

  return (
    <div>
      {/* Main content */}
      <div className="flex flex-col gap-8 sm:mx-8 md:mx-0 md:flex-row md:items-start lg:mx-auto lg:max-w-5xl">
        {/* Poster */}
        <div className="flex justify-center md:sticky md:top-24 md:w-[280px] md:flex-shrink-0">
          <Image
            alt={detail.title}
            className="rounded-xl shadow-2xl"
            height={420}
            src={
              detail.poster_path
                ? `${TMDB_IMAGE_ENDPOINT}${detail.poster_path}`
                : "https://placehold.co/280x420"
            }
            unoptimized
            width={280}
          />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <FilmHeading tagline={detail.tagline} title={detail.title}>
            <WatchlistButton
              id={detail.id}
              media_type="movie"
              poster_path={detail.poster_path ?? ""}
              title={detail.title}
            />
            <AlertButtonWrapper
              id={detail.id}
              media_type="movie"
              poster_path={detail.poster_path ?? ""}
              title={detail.title}
            />
          </FilmHeading>
          <FilmInfo
            language={renderLanguage(detail.spoken_languages || [])}
            length={renderLength(detail.runtime)}
            media_type="movie"
            status={renderStatus(detail.status)}
            year={renderYear(detail.release_date)}
          />
          <FilmGenres genres={detail.genres || []} />
          <FilmSynopsis synopsis={detail.overview} />

          {/* Actions row */}
          <div className="flex flex-wrap items-center gap-3">
            <TrailerSection
              backdropPath={detail.backdrop_path}
              id={detail.id}
              type="movie"
            />
          </div>

          <WatchProviders id={detail.id} type="movie" />
        </div>
      </div>

      {/* Cast */}
      <div className="mt-8 lg:mx-auto lg:max-w-5xl">
        <FilmCasts casts={credits.cast} />
      </div>

      {/* Recommendations */}
      <div className="mt-4 lg:mx-auto lg:max-w-5xl">
        <Recommendations mediaType="movie" id={detail.id} />
      </div>
    </div>
  );
}
