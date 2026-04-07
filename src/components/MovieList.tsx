import useSWR from "swr";
import Heading from "@/components/Heading";
import Loading from "@/components/Loading";
import MovieCard from "@/components/MovieCard";
import type { MediaCardComponent, TMDBMediaItem } from "@/types";
import { fetcher, renderResults, sliceArray } from "@/utils";

interface MovieListProps {
  Component?: MediaCardComponent;
  endpoint: string;
  href: string;
  isHomePage?: boolean;
  isTrending?: boolean;
  limit?: number;
  media_type?: string;
  title: string;
  type?: string;
}

export default function MovieList({
  Component = MovieCard,
  endpoint,
  href,
  isHomePage,
  isTrending,
  limit = 14,
  media_type = "movie",
  title,
  type = "movie",
}: MovieListProps) {
  const { data, error } = useSWR<{ results: TMDBMediaItem[] }>(
    endpoint,
    fetcher
  );

  if (error) {
    return <div>Error occurred</div>;
  }

  return (
    <>
      {data ? (
        <section
          className={
            isTrending
              ? "mb-6 h-full w-full overflow-hidden md:mb-10 lg:overflow-visible"
              : "mb-6 md:mb-10"
          }
        >
          <Heading
            href={href}
            isHomePage={isHomePage}
            isTrending={isTrending}
            media_type={type}
            title={title}
          />
          <ul className="grid grid-cols-2 gap-x-12 gap-y-16 sm:grid-cols-4 lg:grid-cols-7">
            {renderResults(
              sliceArray(data.results || [], limit),
              Component,
              media_type
            )}
          </ul>
        </section>
      ) : (
        <Loading />
      )}
    </>
  );
}
