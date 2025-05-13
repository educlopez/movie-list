import Image from 'next/image'
import { useRouter } from 'next/router'
import { TMDB_IMAGE_THUMB_ENDPOINT } from '@/utils'
import { FilmIcon, MonitorIcon } from '@iconicicons/react'
import { motion } from 'framer-motion'

import { FADE_IN_ANIMATION_CARD_HOVER } from '@/lib/constants'

export default function MovieCard({ id, category, src, title, year }) {
  const router = useRouter()

  const handleClick = () => {
    if (category === 'movie') {
      router.push(`/movie/${id}`)
    } else if (category === 'tv') {
      router.push(`/tv/${id}`)
    }
  }

  return (
    <motion.li
      className="flex relative flex-col items-start cursor-pointer group"
      {...FADE_IN_ANIMATION_CARD_HOVER}
    >
      <div onClick={handleClick}>
        <Image
          src={
            src !== 'null'
              ? `${TMDB_IMAGE_THUMB_ENDPOINT}${src}`
              : 'https://placehold.co/150x225'
          }
          alt={title}
          width={220}
          height={330}
          className="w-full rounded-md"
          unoptimized
        />
        <p className="mt-1 text-center dark:text-zinc-400 text-zinc-600">
          {title}
        </p>
        <p className="mt-1 text-center dark:text-zinc-400 text-zinc-600">
          {renderYear(year)}
        </p>
        <p className="flex justify-center mt-1 dark:text-zinc-400 text-zinc-600">
          {renderCategoryIcon(category)}
          <span className="pl-[6px] pr-[6px]">
            {renderCategoryText(category)}
          </span>
        </p>
      </div>
    </motion.li>
  )
}

function renderYear(year) {
  if (!year) {
    return 'N/A'
  } else {
    return year.substring(0, 4)
  }
}

function renderCategoryIcon(category) {
  if (category === 'movie') {
    return <FilmIcon className="pl-1 text-base" />
  } else {
    return <MonitorIcon className="pl-1 text-base" />
  }
}

function renderCategoryText(category) {
  if (category === 'movie') {
    return 'Movie'
  } else {
    return 'TV Shows'
  }
}

function renderRating(rating) {
  if (rating === true) {
    return '18+'
  } else {
    return 'E'
  }
}
