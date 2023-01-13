const API_KEY = process.env.NEXT_PUBLIC_API_TMDB;
export const fetchMovies = async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=eu-EN&page=1`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchMovie = async (movieId) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-EU`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
