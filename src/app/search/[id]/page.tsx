import { Button } from "@/components/Button";
import MovieListSearch from "@/components/MovieListSearch";
import { search } from "@/lib/tmdb";
import type { TMDBSearchResponse, TMDBSearchResult } from "@/types/tmdb";

interface SearchPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    title: `${id} - Search Results`,
  };
}

export default async function Search({
  params,
  searchParams,
}: SearchPageProps) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const page = pageParam || "1";

  const url = search(id, page);
  const response = await fetch(url);
  const data: TMDBSearchResponse = await response.json();

  const filteredResults: TMDBSearchResult[] = data
    ? data.results.filter((item) => item.media_type !== "person")
    : [];

  return (
    <>
      {data ? (
        <>
          <MovieListSearch
            arr={filteredResults}
            searchTerm={id}
            totalResult={data.total_results}
          />
          <div className="mt-24 flex justify-center gap-5">
            {Number.parseInt(page, 10) === 1 ? (
              <>
                <Button disabled variant="disabled">
                  First page
                </Button>
                <Button disabled variant="disabled">
                  Prev page
                </Button>
              </>
            ) : (
              <>
                <Button href={`/search/${id}?page=1`}>First</Button>
                <Button
                  href={`/search/${id}?page=${Number.parseInt(page, 10) - 1}`}
                >
                  Prev Page
                </Button>
              </>
            )}
            {Number.parseInt(page, 10) === data.total_pages ? (
              <>
                <Button disabled variant="disabled">
                  Next page
                </Button>
                <Button disabled variant="disabled">
                  Last page
                </Button>
              </>
            ) : (
              <>
                <Button
                  href={`/search/${id}?page=${Number.parseInt(page, 10) + 1}`}
                >
                  Next Page
                </Button>
                <Button href={`/search/${id}?page=${data.total_pages}`}>
                  Last
                </Button>
              </>
            )}
          </div>
        </>
      ) : null}
    </>
  );
}
