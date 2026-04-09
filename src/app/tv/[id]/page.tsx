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
import { getTvCasts, getTvDetail } from "@/lib/tmdb";
import type { TMDBCreditsResponse, TMDBTvDetail } from "@/types/tmdb";
import { TMDB_IMAGE_ENDPOINT } from "@/utils";
import { renderLanguage, renderStatus } from "@/utils/media";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const res = await fetch(getTvDetail(id));
  const detail: TMDBTvDetail = await res.json();
  const posterUrl = detail.poster_path
    ? `https://image.tmdb.org/t/p/w500${detail.poster_path}`
    : undefined;
  return {
    title: detail.name,
    description:
      detail.overview || `Información sobre la serie ${detail.name}`,
    openGraph: {
      title: detail.name,
      description:
        detail.overview || `Información sobre la serie ${detail.name}`,
      ...(posterUrl && {
        images: [
          { url: posterUrl, width: 500, height: 750, alt: detail.name },
        ],
      }),
    },
  };
}

export default async function TV({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [detailRes, creditsRes] = await Promise.all([
    fetch(getTvDetail(id)),
    fetch(getTvCasts(id)),
  ]);
  const [detail, credits]: [TMDBTvDetail, TMDBCreditsResponse] =
    await Promise.all([detailRes.json(), creditsRes.json()]);

  return (
    <div>
      {/* Main content */}
      <div className="flex flex-col gap-8 sm:mx-8 md:mx-0 md:flex-row md:items-start lg:mx-auto lg:max-w-5xl">
        {/* Poster */}
        <div className="flex justify-center md:sticky md:top-24 md:w-[280px] md:flex-shrink-0">
          <Image
            alt={detail.name}
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
          <FilmHeading tagline={detail.tagline} title={detail.name}>
            <WatchlistButton
              id={detail.id}
              media_type="tv"
              poster_path={detail.poster_path ?? ""}
              title={detail.name}
            />
            <AlertButtonWrapper
              id={detail.id}
              media_type="tv"
              poster_path={detail.poster_path ?? ""}
              title={detail.name}
            />
          </FilmHeading>
          <FilmInfo
            firstAir={detail.first_air_date}
            language={renderLanguage(detail.spoken_languages || [])}
            lastAir={detail.last_air_date}
            media_type="tv"
            status={renderStatus(detail.status)}
          />
          <FilmGenres genres={detail.genres || []} />
          <FilmSynopsis synopsis={detail.overview} />

          {/* Actions row */}
          <div className="flex flex-wrap items-center gap-3">
            <TrailerSection
              backdropPath={detail.backdrop_path}
              id={detail.id}
              type="tv"
            />
          </div>

          <WatchProviders id={detail.id} type="tv" />
        </div>
      </div>

      {/* Cast */}
      <div className="mt-8 lg:mx-auto lg:max-w-5xl">
        <FilmCasts casts={credits.cast} />
      </div>

      {/* Recommendations */}
      <div className="mt-4 lg:mx-auto lg:max-w-5xl">
        <Recommendations mediaType="tv" id={detail.id} />
      </div>
    </div>
  );
}
