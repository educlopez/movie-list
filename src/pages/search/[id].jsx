import Head from 'next/head'

import { search } from '@/lib/tmdb'
import { Button } from '@/components/Button'
import Loading from '@/components/Loading'
import MovieListSearch from '@/components/MovieListSearch'

export default function Search({ data, id, page }) {
  const filteredResults = data
    ? data.results.filter((item) => item.media_type !== 'person')
    : []

  return (
    <>
      <Head>
        <title>{id} - Search Results - Movielist</title>
      </Head>
      {data ? (
        <>
          <MovieListSearch
            arr={filteredResults}
            searchTerm={id}
            totalResult={data.total_results}
          />
          <div className="flex justify-center gap-5 mt-24">
            {parseInt(page) === 1 ? (
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
                <Button href={`/search/${id}?page=${parseInt(page) - 1}`}>
                  Prev Page
                </Button>
              </>
            )}
            {parseInt(page) === data.total_pages ? (
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
                <Button href={`/search/${id}?page=${parseInt(page) + 1}`}>
                  Next Page
                </Button>
                <Button href={`/search/${id}?page=${data.total_pages}`}>
                  Last
                </Button>
              </>
            )}
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  )
}

export async function getServerSideProps(context) {
  const { id, page } = context.query
  const url = search(id, page)
  const response = await fetch(url)
  const data = await response.json()

  return {
    props: {
      data,
      id,
      page,
    },
  }
}
