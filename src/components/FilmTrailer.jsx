import { API_KEY, TMDB_VIDEO_ENDPOINT } from '@/utils'

export default function FilmTrailer({ src }) {
  return (
    <section className="px-20 text-center md:pr-8 md:pl-0 lg:w-2/5">
      <a
        className="rounded-lg"
        href={`${TMDB_VIDEO_ENDPOINT}/${src}?=${API_KEY}`}
      >
        Trailer
      </a>
    </section>
  )
}
