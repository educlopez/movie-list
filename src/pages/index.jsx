import Head from 'next/head';
import { useState, useEffect } from 'react';
import { fetchMovies } from '@/pages/api/tmdb';
import MovieList from '@/components/MovieList';

export default function Home() {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMovies();
        setMovies(data.results.slice(0, 10));
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Movielist</title>
        <meta
          name="description"
          content="Discover the latest movies and watch your favorites on Movielist - the ultimate movie search engine. Browse through our extensive selection and find the perfect film for you. Start watching now!"
        />
        <meta
          name="keywords"
          content="movies, watch, search, favorites, film, selection, Movielist"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="">
        <MovieList movies={movies} />
      </div>
    </>
  );
}
