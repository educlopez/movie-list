import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Loading from '@/components/Loading';
import MovieListSearch from '@/components/MovieListSearch';
import { fetcher } from '@/utils';

export default function NowPlayingMovies() {
  const router = useRouter();
  const { id } = router.query;
  const currentPage = Number(id);
  const { data, error } = useSWR(
    `/api/tv/airing-today/${currentPage}`,
    fetcher
  );
  const isFirst = currentPage === 1;
  const isLast = data ? currentPage === data.total_pages : false;
  const limitNormal = 10;
  return (
    <div>
      <Head>
        <title>Airing Today TV Shows - Movielist</title>
      </Head>
      <h1> Airing today tv shows</h1>
      {data ? (
        <>
          <MovieListSearch isGenre arr={data.results} />
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}
