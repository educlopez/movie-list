import React from 'react'
import Image from 'next/image'
import { TMDB_IMAGE_ENDPOINT, shimmer, toBase64 } from '@/utils'

export default function FilmCasts({ casts }) {
  return (
    <div className="w-full mb-10 text-zinc-900 dark:text-white">
      <h3 className="mb-2 md:text-lg">Top Billed Cast</h3>
      <ul className="relative flex overflow-x-auto text-xs md:text-sm gap-x-6 touch-pan-y y-scroll">
        {renderCasts(casts)}
      </ul>
    </div>
  )
}

function renderCasts(arr) {
  if (Array.isArray(arr) && arr.length !== 0) {
    return arr.map((cast) => {
      return (
        <li
          key={cast.credit_id}
          className="flex-none border rounded-2xl border-zinc-900/10 bg-white/10 backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/20 dark:backdrop-blur "
        >
          <div className="flex flex-col items-center justify-center w-full gap-3 pb-2">
            <Image
              className="rounded-lg"
              src={
                cast.profile_path
                  ? `${TMDB_IMAGE_ENDPOINT}/${cast.profile_path}`
                  : 'https://via.placeholder.com/150x225'
              }
              alt={cast.name}
              width={150}
              height={225}
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer(350, 530)
              )}`}
              unoptimized
            />
            <span className="px-2 mx-auto text-xs text-center text-zinc-900 dark:text-white lg:text-sm">
              <p className="font-bold">{cast.name}</p>
              <p className="w-32 truncate">{cast.character}</p>
            </span>
          </div>
        </li>
      )
    })
  } else {
    return 'N/A'
  }
}
