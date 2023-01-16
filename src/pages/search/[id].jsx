import Head from 'next/head';
import MovieListSearch from '@/components/MovieListSearch';
import Loading from '@/components/Loading';
import { search } from '@/lib/tmdb';

export default function Search({ data, id, page }) {
  const filteredResults = data
    ? data.results.filter((item) => item.media_type !== 'person')
    : [];

  return (
    <>
      <Head>
        <title>{id} - Search Results - Movielist</title>
      </Head>

      {data ? (
        <>
          <MovieListSearch
            arr={filteredResults}
            searchTerm={id}
            totalResult={data.total_results}
          />
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const { id, page } = context.query;
  const url = search(id, page);
  const response = await fetch(url);
  const data = await response.json();

  return {
    props: {
      data,
      id,
      page
    }
  };
}
