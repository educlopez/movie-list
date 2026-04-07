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
import type { TvDetailResponse } from "@/types";
import { fetcher } from "@/utils";
import { renderLanguage, renderStatus } from "@/utils/media";

export default function TV({
  params,
}: {
  params: Promise<{ id: string }>;
}): React.JSX.Element {
  const { id } = use(params);
  const { data: tv, error: tvError } = useSWR<TvDetailResponse>(
    `/api/tv/${id}`,
    fetcher
  );

  if (tvError) {
    return <div>{tvError}</div>;
  }
  if (!tv) {
    return <div>{tvError}</div>;
  }

  return (
    <>
      {tv ? (
        <>
          <div className="flex flex-col sm:mx-8 md:mx-0 md:flex-row md:items-start lg:justify-center">
            <FilmImage src={tv.detail.poster_path} title={tv.detail.name} />
            <div className="md:w-3/5">
              <FilmHeading tagline={tv.detail.tagline} title={tv.detail.name} />
              <FilmInfo
                firstAir={tv.detail.first_air_date}
                language={renderLanguage(tv.detail.spoken_languages || [])}
                lastAir={tv.detail.last_air_date}
                media_type="tv"
                status={renderStatus(tv.detail.status)}
              />
              <FilmGenres genres={tv.detail.genres || []} />
              <FilmSynopsis synopsis={tv.detail.overview} />
              <WatchProviders id={tv.detail.id} type="tv" />
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:mx-8 md:mx-0 md:flex-row md:items-start lg:justify-center">
            <FilmCasts casts={tv.credits.cast} />
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}
