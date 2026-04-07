"use client";

import { use } from "react";
import useSWR from "swr";
import Loading from "@/components/Loading";
import MovieListSearch from "@/components/MovieListSearch";
import type { TMDBPaginatedResponse } from "@/types/tmdb";
import { fetcher } from "@/utils";

export default function NowPlayingMovies({
  params,
}: {
  params: Promise<{ id: string }>;
}): React.JSX.Element {
  const { id } = use(params);
  const currentPage = Number(id);
  const { data } = useSWR<TMDBPaginatedResponse>(
    `/api/movie/now/${currentPage}`,
    fetcher
  );

  return (
    <div>
      <h1> Now playing movies</h1>
      {data ? <MovieListSearch arr={data.results} isGenre /> : <Loading />}
    </div>
  );
}
