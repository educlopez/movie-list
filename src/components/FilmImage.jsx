import Image from 'next/image'
import { TMDB_IMAGE_ENDPOINT, shimmer, toBase64 } from '@/utils'

export default function FilmImage({ src, title }) {
  return (
    <section className="px-20 text-center md:pr-8 md:pl-0 lg:w-2/5">
      <Image
        className="rounded-lg"
        src={
          src !== null
            ? `${TMDB_IMAGE_ENDPOINT}${src}`
            : 'https://placehold.co/150x225'
        }
        alt={title}
        width={300}
        height={450}
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(350, 530))}`}
        unoptimized
      />
    </section>
  )
}
