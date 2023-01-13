import MovieCard from './MovieCard';

const MovieList = ({ movies }) => {
  return (
    <ul className="grid grid-cols-2 gap-x-12 gap-y-16 sm:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movieId={movie.id} />
      ))}
    </ul>
  );
};
export default MovieList;
