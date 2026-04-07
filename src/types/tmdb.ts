import type { ReactElement } from "react";

/** A media item returned by the TMDB API (movie or TV show). */
export interface TMDBMediaItem {
  adult: boolean;
  backdrop_path: string | null;
  first_air_date?: string;
  id: number;
  media_type?: "movie" | "tv" | "person";
  original_name?: string;
  original_title?: string;
  poster_path: string | null;
  release_date?: string;
  title?: string;
  vote_average?: number;
}

/** Props passed to the card component used by renderResults / renderResultsSlider. */
export interface MediaCardProps {
  category: string;
  id: number;
  key: string | number;
  rating: boolean;
  src: string;
  title: string;
  vote_average?: number;
  year: string | undefined;
}

/** A spoken language object from a TMDB detail response. */
export interface TMDBLanguage {
  english_name?: string;
  iso_639_1: string;
  name: string;
}

/** Component type accepted by renderResults / renderResultsSlider. */
export type MediaCardComponent = (
  props: Omit<MediaCardProps, "key">
) => ReactElement;

/** Motion animation settings (initial + animate + transition). */
export interface MotionAnimationSettings {
  animate: Record<string, number>;
  initial: Record<string, number>;
  transition: Record<string, string | number>;
}

/** Motion card animation with viewport. */
export interface MotionCardAnimation {
  initial: Record<string, number>;
  transition: Record<string, number>;
  viewport: Record<string, boolean>;
  whileHover?: Record<string, number>;
  whileInView: Record<string, number>;
  whileTap?: Record<string, number>;
}

/** Genre from TMDB detail response. */
export interface TMDBGenre {
  id: number;
  name: string;
}

/** Cast member from TMDB credits response. */
export interface TMDBCastMember {
  character: string;
  credit_id: string;
  id: number;
  name: string;
  order: number;
  profile_path: string | null;
}

/** TMDB credits response. */
export interface TMDBCreditsResponse {
  cast: TMDBCastMember[];
  id: number;
}

/** TMDB movie detail response. */
export interface TMDBMovieDetail {
  adult: boolean;
  backdrop_path: string | null;
  genres: TMDBGenre[];
  id: number;
  overview: string;
  poster_path: string | null;
  release_date: string;
  runtime: number;
  spoken_languages: TMDBLanguage[];
  status: string;
  tagline: string;
  title: string;
}

/** TMDB TV show detail response. */
export interface TMDBTvDetail {
  backdrop_path: string | null;
  first_air_date: string;
  genres: TMDBGenre[];
  id: number;
  last_air_date: string;
  name: string;
  overview: string;
  poster_path: string | null;
  spoken_languages: TMDBLanguage[];
  status: string;
  tagline: string;
}

/** Combined movie detail + credits API response. */
export interface MovieDetailResponse {
  credits: TMDBCreditsResponse;
  detail: TMDBMovieDetail;
}

/** Combined TV detail + credits API response. */
export interface TvDetailResponse {
  credits: TMDBCreditsResponse;
  detail: TMDBTvDetail;
}

/** Paginated list response from TMDB API routes. */
export interface TMDBPaginatedResponse {
  results: TMDBMediaItem[];
  total_pages: number;
  total_results: number;
}

/** TMDB search result item (extends media item with media_type). */
export interface TMDBSearchResult extends TMDBMediaItem {
  media_type: "movie" | "tv" | "person";
  profile_path?: string | null;
}

/** TMDB search response. */
export interface TMDBSearchResponse {
  page: number;
  results: TMDBSearchResult[];
  total_pages: number;
  total_results: number;
}

/** API error response. */
export interface ApiErrorResponse {
  error: string;
}

/** JustWatch package/platform info. */
export interface JWPackage {
  clearName: string;
  icon: string;
  monetizationTypes?: string[];
  packageId: number;
  shortName: string;
}

/** JustWatch provider results for a day. */
export interface JWProviderResults {
  clearName: string;
  icon: string;
  items: DiscoverItem[];
  packageId: number;
  shortName: string;
}

/** JustWatch day response. */
export interface JWDayResponse {
  date: string;
  endCursor: string | null;
  hasNextPage: boolean;
  providers: JWProviderResults[];
  totalCount: number;
}

/** JustWatch packages response. */
export interface JWPackagesResponse {
  allPackages?: JWPackage[];
  packages: JWPackage[];
}

/** Extended media item with rating and overview for trending. */
export interface TMDBTrendingItem extends TMDBMediaItem {
  genre_ids: number[];
  overview: string;
  vote_average: number;
}

/** Trending API response. */
export interface TrendingResponse {
  results: TMDBTrendingItem[];
}

/** Genre list API response. */
export interface GenreListResponse {
  genres: TMDBGenre[];
}

/** A discover result item. */
export interface DiscoverItem {
  genre_ids: number[];
  id: number;
  media_type: "movie" | "tv";
  poster_path: string | null;
  release_date: string;
  title: string;
  vote_average: number;
}

/** Discover API response. */
export interface DiscoverResponse {
  page: number;
  results: DiscoverItem[];
  total_pages: number;
}

/** Provider group within a day's results. */
export interface ProviderResults {
  items: DiscoverItem[];
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

/** Day discover response grouped by platform. */
export interface DayDiscoverResponse {
  date: string;
  providers: ProviderResults[];
}
