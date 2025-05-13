import React from 'react';
import Image from 'next/image';
import { TMDB_IMAGE_CAST_ENDPOINT, shimmer, toBase64 } from '@/utils'





export default function FilmCasts({ casts }) {
  return (
    <div className="mb-10 w-full text-zinc-900 dark:text-white">
      <h3 className="mb-2 md:text-lg">Top Billed Cast</h3>
      <ul className="flex overflow-x-auto relative gap-x-6 text-xs md:text-sm touch-pan-y y-scroll">
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
          className="flex-none rounded-2xl border backdrop-blur-sm border-zinc-900/10 bg-white/10 dark:border-white/10 dark:bg-zinc-900/20 dark:backdrop-blur"
        >
          <div className="flex flex-col gap-3 justify-center items-center pb-2 w-full">
            <Image
              className="rounded-lg"
              src={
                cast.profile_path
                  ? `${TMDB_IMAGE_CAST_ENDPOINT}${cast.profile_path}`
                  : 'https://placehold.co/150x225'
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