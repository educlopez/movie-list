import MovieCard from "@/components/MovieCard";
import type { TMDBMediaItem } from "@/types/tmdb";
import { renderResults, sliceArray } from "@/utils";

interface MovieListSearchProps {
  arr?: TMDBMediaItem[];
  isGenre?: boolean;
  limit?: number;
  media_type?: string;
  searchTerm?: string;
  totalResult?: number;
}

export default function MovieListSearch({
  arr = [],
  isGenre,
  limit = 21,
  media_type = "movie",
  searchTerm = "",
  totalResult = 0,
}: MovieListSearchProps) {
  return (
    <div>
      {isGenre ? null : (
        <h1 className="md:heading-lg mb-6 font-light text-xl text-zinc-900 lg:mb-8 dark:text-white">
          {`Found ${totalResult} results for '${searchTerm}'`}
        </h1>
      )}
      <ul className="grid grid-cols-2 gap-x-12 gap-y-16 sm:grid-cols-4 lg:grid-cols-7">
        {renderResults(sliceArray(arr, limit), MovieCard, media_type)}
      </ul>
    </div>
  );
}
