import { fetcher, renderResults, sliceArray } from '@/utils'
import useSWR from 'swr'

import Heading from '@/components/Heading'
import Loading from '@/components/Loading'
import MovieCard from '@/components/MovieCard'

export default function MovieList({
  Component = MovieCard,
  endpoint,
  href,
  isHomePage,
  isTrending,
  limit = 8,
  media_type = 'movie',
  title,
  type = 'movie',
}) {
  const { data, error } = useSWR(endpoint, fetcher)

  if (error) return <div>Error occurred</div>

  return (
    <>
      {data ? (
        <section
          className={
            isTrending
              ? 'mb-6 h-full w-full overflow-hidden md:mb-10 lg:overflow-visible'
              : 'mb-6 md:mb-10'
          }
        >
          <Heading
            title={title}
            href={href}
            isHomePage={isHomePage}
            isTrending={isTrending}
            media_type={type}
          />
          <ul className="grid grid-cols-2 gap-x-12 gap-y-16 sm:grid-cols-4 lg:grid-cols-5">
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
  )
}
