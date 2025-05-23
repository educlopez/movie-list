import { API_KEY, TMDB_ENDPOINT, TMDB_VIDEO_ENDPOINT } from '@/utils'

// export function getUrl(endpoint, optional = '') {
//   return `${TMDB_ENDPOINT}/${endpoint}?api_key=${API_KEY}${optional}`
// }

export function getUrl(endpoint, id, genre, page) {
  return `${TMDB_ENDPOINT}/${endpoint}?api_key=${API_KEY}&with_genres=${id}&name=${genre}&page=${page}`
}

// TODO: Change the function name
export function getUrl2(endpoint, page) {
  return `${TMDB_ENDPOINT}/${endpoint}?api_key=${API_KEY}&page=${page}`
}

export function getGenre(endpoint) {
  return `${TMDB_ENDPOINT}/${endpoint}?api_key=${API_KEY}`
}

export function getMovieDetail(id) {
  return `${TMDB_ENDPOINT}/movie/${id}?api_key=${API_KEY}`
}

export function getMovieCasts(id) {
  return `${TMDB_ENDPOINT}/movie/${id}/credits?api_key=${API_KEY}`
}

export function getTvDetail(id) {
  return `${TMDB_ENDPOINT}/tv/${id}?api_key=${API_KEY}`
}

export function getTvCasts(id) {
  return `${TMDB_ENDPOINT}/tv/${id}/credits?api_key=${API_KEY}`
}

// Search for movies and TV Shows
export function search(query, page) {
  return `${TMDB_ENDPOINT}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
    query
  )}&page=${page}`
}
// Search for movies only
export function searchMovie(query, page) {
  return `${TMDB_ENDPOINT}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
    query
  )}&page=${page}`
}

// Search for TV Shows only
export function searchTv(query, page) {
  return `${TMDB_ENDPOINT}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(
    query
  )}&page=${page}`
}

// Trending
export const trendingAllDay = 'trending/all/day'
export const trendingAllWeek = 'trending/all/week'
export const trendingMovieDay = 'trending/movie/day'
export const trendingMovieWeek = 'trending/movie/week'
export const trendingTvDay = 'trending/tv/day'
export const trendingTvWeek = 'trending/tv/week'

// Movie
export const moviePopular = 'movie/popular'
export const movieNowPlaying = 'movie/now_playing'
export const movieUpcoming = 'movie/upcoming'
export const movieTopRated = 'movie/top_rated'
export const movieLatest = 'movie/latest'

// TV
export const tvPopular = 'tv/popular'
export const tvAiringToday = 'tv/airing_today'
export const tvOnTheAir = 'tv/on_the_air'
export const tvTopRated = 'tv/top_rated'

// Genre
export const genreMovie = '/genre/movie/list'
export const genreTV = '/genre/tv/list'

// Discover
export const discoverMovie = 'discover/movie'
export const discoverTV = 'discover/tv'
