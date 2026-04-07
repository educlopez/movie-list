import { API_KEY, TMDB_ENDPOINT } from "@/utils";

export function getMovieWatchProviders(id: string | number): string {
  return `${TMDB_ENDPOINT}/movie/${id}/watch/providers?api_key=${API_KEY}`;
}

export function getTvWatchProviders(id: string | number): string {
  return `${TMDB_ENDPOINT}/tv/${id}/watch/providers?api_key=${API_KEY}`;
}

export function getAvailableMoviePlatforms(region: string): string {
  return `${TMDB_ENDPOINT}/watch/providers/movie?api_key=${API_KEY}&watch_region=${region}`;
}

export function getAvailableTvPlatforms(region: string): string {
  return `${TMDB_ENDPOINT}/watch/providers/tv?api_key=${API_KEY}&watch_region=${region}`;
}
