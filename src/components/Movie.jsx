import { useState, useEffect } from 'react';
import Image from 'next/image';

const API_KEY = process.env.NEXT_PUBLIC_API_TMDB;

const Movie = ({ movieId }) => {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
        );
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  if (!movie) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>
    </div>
  );
};
export default Movie;
