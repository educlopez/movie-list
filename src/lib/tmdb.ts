import { API_KEY, TMDB_ENDPOINT } from "@/utils";

export function getUrl(
  endpoint: string,
  id: string | number,
  genre: string,
  page: number | string
): string {
  return `${TMDB_ENDPOINT}/${endpoint}?api_key=${API_KEY}&with_genres=${id}&name=${genre}&page=${page}`;
}

// TODO: Change the function name
export function getUrl2(endpoint: string, page: number | string): string {
  return `${TMDB_ENDPOINT}/${endpoint}?api_key=${API_KEY}&page=${page}`;
}

export function getGenre(endpoint: string): string {
  return `${TMDB_ENDPOINT}/${endpoint}?api_key=${API_KEY}`;
}

export function getMovieDetail(id: string | number): string {
  return `${TMDB_ENDPOINT}/movie/${id}?api_key=${API_KEY}`;
}

export function getMovieCasts(id: string | number): string {
  return `${TMDB_ENDPOINT}/movie/${id}/credits?api_key=${API_KEY}`;
}

export function getTvDetail(id: string | number): string {
  return `${TMDB_ENDPOINT}/tv/${id}?api_key=${API_KEY}`;
}

export function getTvCasts(id: string | number): string {
  return `${TMDB_ENDPOINT}/tv/${id}/credits?api_key=${API_KEY}`;
}

export function getTrending(mediaType: string, timeWindow: string): string {
  return `${TMDB_ENDPOINT}/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}`;
}

export function getGenreList(type: string): string {
  return `${TMDB_ENDPOINT}/genre/${type}/list?api_key=${API_KEY}`;
}

// Search for movies and TV Shows
export function search(query: string, page: number | string): string {
  return `${TMDB_ENDPOINT}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
    query
  )}&page=${page}`;
}

// Search for movies only
export function searchMovie(query: string, page: number | string): string {
  return `${TMDB_ENDPOINT}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
    query
  )}&page=${page}`;
}

// Search for TV Shows only
export function searchTv(query: string, page: number | string): string {
  return `${TMDB_ENDPOINT}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(
    query
  )}&page=${page}`;
}

// Trending
export const trendingAllDay = "trending/all/day" as const;
export const trendingAllWeek = "trending/all/week" as const;
export const trendingMovieDay = "trending/movie/day" as const;
export const trendingMovieWeek = "trending/movie/week" as const;
export const trendingTvDay = "trending/tv/day" as const;
export const trendingTvWeek = "trending/tv/week" as const;

// Movie
export const moviePopular = "movie/popular" as const;
export const movieNowPlaying = "movie/now_playing" as const;
export const movieUpcoming = "movie/upcoming" as const;
export const movieTopRated = "movie/top_rated" as const;
export const movieLatest = "movie/latest" as const;

// TV
export const tvPopular = "tv/popular" as const;
export const tvAiringToday = "tv/airing_today" as const;
export const tvOnTheAir = "tv/on_the_air" as const;
export const tvTopRated = "tv/top_rated" as const;

// Genre
export const genreMovie = "/genre/movie/list" as const;
export const genreTV = "/genre/tv/list" as const;

// Discover
export const discoverMovie = "discover/movie" as const;
export const discoverTV = "discover/tv" as const;
