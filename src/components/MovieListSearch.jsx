import { fetcher, renderResults, sliceArray } from '@/utils'
import useSWR from 'swr'

import MovieCard from '@/components/MovieCard'

export default function MovieList({
  arr = [],
  isGenre,
  limit = 20,
  media_type = 'movie',
  searchTerm = '',
  totalResult = 0,
}) {
  return (
    <>
      <div>
        {!isGenre ? (
          <h1 className="mb-6 text-xl font-light text-zinc-900 dark:text-white md:heading-lg lg:mb-8">{`Found ${totalResult} results for '${searchTerm}'`}</h1>
        ) : null}
        <ul className="grid grid-cols-2 gap-x-12 gap-y-16 sm:grid-cols-4 lg:grid-cols-5">
          {renderResults(sliceArray(arr, limit), MovieCard, media_type)}
        </ul>
      </div>
    </>
  )
}
