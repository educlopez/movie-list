import type { MediaCardComponent, TMDBMediaItem } from "@/types/tmdb";

export const TMDB_ENDPOINT: string | undefined = process.env.TMDB_ENDPOINT;
export const API_KEY: string | undefined = process.env.TMDB_API_KEY;
export const TMDB_IMAGE_THUMB_ENDPOINT =
  "https://image.tmdb.org/t/p/w440_and_h660_face" as const;
export const TMDB_IMAGE_ENDPOINT =
  "https://image.tmdb.org/t/p/w600_and_h900_bestv2" as const;
export const TMDB_IMAGE_CAST_ENDPOINT =
  "https://image.tmdb.org/t/p/w276_and_h350_face" as const;
export const TMDB_IMAGE_MULTIFACES =
  "https://image.tmdb.org/t/p/w1280" as const;
export const pathToSearchAll = "/search/" as const;
export const pathToSearchMovie = "/search/movie/" as const;
export const pathToSearchTV = "/search/tv/" as const;

export const fetcher = <T = unknown>(url: string): Promise<T> =>
  fetch(url).then((res) => res.json());

export const shimmer = (w: number, h: number): string => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>
`;

export const toBase64 = (str: string): string =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const renderResults = (
  array: TMDBMediaItem[],
  Component: MediaCardComponent,
  media_type?: string
) => {
  return array.map((item) => (
    <Component
      category={item.media_type || media_type || ""}
      id={item.id}
      key={item.id || crypto.randomUUID()}
      rating={item.adult}
      src={item.poster_path ? `${item.poster_path}` : `${item.backdrop_path}`}
      title={
        item.title
          ? item.title
          : item.original_name || item.original_title || ""
      }
      year={item.release_date || item.first_air_date}
    />
  ));
};

export const renderResultsSlider = (
  array: TMDBMediaItem[],
  Component: MediaCardComponent,
  media_type?: string
) => {
  return array.map((item) => (
    <Component
      category={item.media_type || media_type || ""}
      id={item.id}
      key={item.id || crypto.randomUUID()}
      rating={item.adult}
      src={item.backdrop_path ? `${item.backdrop_path}` : `${item.poster_path}`}
      title={
        item.title
          ? item.title
          : item.original_name || item.original_title || ""
      }
      year={item.release_date || item.first_air_date}
    />
  ));
};

export const sliceArray = <T,>(arr: T[], limit: number): T[] => {
  return arr.slice(0, limit);
};
