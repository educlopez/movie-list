import type { Metadata } from "next";

import FilmCasts from "@/components/FilmCasts";
import FilmGenres from "@/components/FilmGenres";
import FilmHeading from "@/components/FilmHeading";
import FilmImage from "@/components/FilmImage";
import FilmInfo from "@/components/FilmInfo";
import FilmSynopsis from "@/components/FilmSynopsis";
import WatchProviders from "@/components/WatchProviders";
import { getTvCasts, getTvDetail } from "@/lib/tmdb";
import type { TMDBCreditsResponse, TMDBTvDetail } from "@/types/tmdb";
import { renderLanguage, renderStatus } from "@/utils/media";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const res = await fetch(getTvDetail(id));
  const detail: TMDBTvDetail = await res.json();
  return { title: detail.name };
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
    <>
      <div className="flex flex-col sm:mx-8 md:mx-0 md:flex-row md:items-start lg:justify-center">
        <FilmImage src={detail.poster_path} title={detail.name} />
        <div className="md:w-3/5">
          <FilmHeading tagline={detail.tagline} title={detail.name} />
          <FilmInfo
            firstAir={detail.first_air_date}
            language={renderLanguage(detail.spoken_languages || [])}
            lastAir={detail.last_air_date}
            media_type="tv"
            status={renderStatus(detail.status)}
          />
          <FilmGenres genres={detail.genres || []} />
          <FilmSynopsis synopsis={detail.overview} />
          <WatchProviders id={detail.id} type="tv" />
        </div>
      </div>
      <div className="mt-4 flex flex-col sm:mx-8 md:mx-0 md:flex-row md:items-start lg:justify-center">
        <FilmCasts casts={credits.cast} />
      </div>
    </>
  );
}
