import type { Metadata } from "next";

import FilmCasts from "@/components/FilmCasts";
import FilmGenres from "@/components/FilmGenres";
import FilmHeading from "@/components/FilmHeading";
import FilmImage from "@/components/FilmImage";
import FilmInfo from "@/components/FilmInfo";
import FilmSynopsis from "@/components/FilmSynopsis";
import WatchProviders from "@/components/WatchProviders";
import { getMovieCasts, getMovieDetail } from "@/lib/tmdb";
import type { TMDBCreditsResponse, TMDBMovieDetail } from "@/types/tmdb";
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
  return { title: detail.title };
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
    <>
      <div className="flex flex-col sm:mx-8 md:mx-0 md:flex-row md:items-start lg:justify-center">
        <FilmImage src={detail.poster_path} title={detail.title} />

        <div className="md:w-3/5">
          <FilmHeading tagline={detail.tagline} title={detail.title} />
          <FilmInfo
            language={renderLanguage(detail.spoken_languages || [])}
            length={renderLength(detail.runtime)}
            media_type="movie"
            status={renderStatus(detail.status)}
            year={renderYear(detail.release_date)}
          />
          <FilmGenres genres={detail.genres || []} />
          <FilmSynopsis synopsis={detail.overview} />
          <WatchProviders id={detail.id} type="movie" />
        </div>
      </div>
      <div className="mt-4 flex flex-col sm:mx-8 md:mx-0 md:flex-row md:items-start lg:justify-center">
        <FilmCasts casts={credits.cast} />
      </div>
    </>
  );
}
