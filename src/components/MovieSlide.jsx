import Image from 'next/image'
import { useRouter } from 'next/router'
import { TMDB_IMAGE_MULTIFACES } from '@/utils'
import { FilmIcon, MonitorIcon } from '@iconicicons/react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { FADE_IN_ANIMATION_CARD_HOVER } from '@/lib/constants'

export function MovieSlide({
  id,
  category,
  poster_path,
  backdrop_path,
  title,
  release_date,
  first_air_date,
  className
}) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/${category}/${id}`)
  }

  const imageSrc = poster_path
    ? `${TMDB_IMAGE_MULTIFACES}${poster_path}`
    : backdrop_path
    ? `${TMDB_IMAGE_MULTIFACES}${backdrop_path}`
    : '/placeholder-image.jpg'

  const year = release_date || first_air_date || 'N/A'

  return (
    <motion.div
      className={cn("relative w-full cursor-pointer aspect-[2/3]", className)}
      onClick={handleClick}
      {...FADE_IN_ANIMATION_CARD_HOVER}
    >
      <Image
        src={imageSrc}
        alt={title}
        className="object-cover rounded-lg"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={(e) => {
          e.target.onerror = null
          e.target.src = '/placeholder-image.jpg'
        }}
      />
      <div className="flex absolute inset-0 flex-col justify-end items-center p-4 bg-gradient-to-t from-black to-transparent rounded-lg">
        <h3 className="text-lg font-bold text-center text-white line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-center text-zinc-300">{renderYear(year)}</p>
        <div className="flex items-center mt-2 text-zinc-300">
          {renderCategoryIcon(category)}
          <span className="ml-2 text-xs">{renderCategoryText(category)}</span>
        </div>
      </div>
    </motion.div>
  )
}

function renderYear(year) {
  return year && typeof year === 'string' ? year.substring(0, 4) : 'N/A'
}

function renderCategoryIcon(category) {
  return category === 'movie' ? (
    <FilmIcon className="w-4 h-4" />
  ) : (
    <MonitorIcon className="w-4 h-4" />
  )
}

function renderCategoryText(category) {
  return category === 'movie' ? 'Movie' : 'TV Show'
}
