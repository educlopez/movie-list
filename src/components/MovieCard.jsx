import { useState, useEffect } from 'react';
import { fetchMovies } from '@/pages/api/tmdb';
import Image from 'next/image';
import Link from 'next/link';

const MovieCard = ({ movieId }) => {
  const [movie, setMovie] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMovies();
        setMovie(data.results.find((m) => m.id === movieId));
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
    <li className="relative flex flex-col items-start group ">
      <Link
        href={`/movie/${movieId}`}
        className="transition group-hover:scale-110"
      >
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          width={300}
          height={450}
          className="w-full rounded-md"
        />
        <p className="mt-1 text-center dark:text-zinc-400 text-zinc-600">
          {movie.title}
        </p>
      </Link>
    </li>
  );
};
export default MovieCard;
