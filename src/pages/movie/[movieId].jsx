import Head from 'next/head';
import { useState, useEffect } from 'react';
import { fetchMovie } from '@/pages/api/tmdb';
import Image from 'next/image';

const Movie = ({ movieId }) => {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMovie(movieId);
        setMovie(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [movieId]);

  if (!movie) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Head>
        <title>{movie.title} - Movielist</title>
        <meta name="description" content={movie.overview} />
        <meta
          name="keywords"
          content="movies, watch, search, favorites, film, selection, Movielist"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
        <div className="lg:col-span-3 lg:row-end-1 justify-items-center sm:justify-items-start">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            width={300}
            height={450}
            className="m-auto"
          />
        </div>
        <div className="max-w-2xl mx-auto mt-14 sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
          <div className="flex flex-col-reverse">
            <div className="mt-4">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                {movie.title} <span className="">{movie.status}</span>
              </h1>
              <h2 id="information-heading" className="sr-only">
                Título pelicula
              </h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Fecha de estreno{' '}
                <time dateTime={movie.release_date}>{movie.release_date}</time>
              </p>
            </div>
          </div>
          <p className="mt-6 text-zinc-500 dark:text-zinc-00">
            {movie.overview}
          </p>
          <ul className="mt-6">
            {movie.genres.map((genre) => (
              <li
                key={genre.id}
                className="inline-flex mr-2 mb-2 gap-0.5 justify-center overflow-hidden text-sm font-medium transition rounded-full bg-zinc-900 py-1 px-3 text-white hover:bg-zinc-700 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300 dark:hover:ring-emerald-300"
              >
                {genre.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { movieId } = context.params;
  return { props: { movieId } };
};

export default Movie;
