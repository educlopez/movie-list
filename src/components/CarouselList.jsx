import { useState } from 'react'
import { fetcher } from '@/utils'
import { ChevronLeftIcon, ChevronRightIcon } from '@iconicicons/react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import useSWR from 'swr'

import Loading from '@/components/Loading'
import { MovieSlide } from '@/components/MovieSlide'

export default function CarouselList({
  Component = MovieSlide,
  endpoint,
  media_type = 'movie',
}) {
  const { data, error } = useSWR(endpoint, fetcher)
  const [index, setIndex] = useState(0)

  if (error) return <div>Error occurred</div>
  if (!data) return <Loading />

  const movies = data.results || []
  const totalSlides = movies.length

  const handlePrev = () =>
    setIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex))
  const handleNext = () =>
    setIndex((prevIndex) =>
      prevIndex < totalSlides - 1 ? prevIndex + 1 : prevIndex
    )

  return (
    <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
      <div className="overflow-hidden h-96 bg-black">
        <div className="flex relative justify-center mx-auto max-w-full h-full">
          <motion.div
            animate={{ x: `-${index * 100}%` }}
            className="flex w-full"
          >
            {movies.map((movie) => (
              <div key={movie.id} className="flex-shrink-0 w-full">
                <Component
                  {...movie}
                  category={media_type}
                  className="aspect-[2/1]"
                  poster_path={movie.backdrop_path}
                />
              </div>
            ))}
          </motion.div>

          <AnimatePresence initial={false}>
            {index > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0, pointerEvents: 'none' }}
                whileHover={{ opacity: 1 }}
                className="flex absolute left-2 top-1/2 z-10 justify-center items-center -mt-4 w-8 h-8 bg-white rounded-full"
                onClick={handlePrev}
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {index < totalSlides - 1 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0, pointerEvents: 'none' }}
                whileHover={{ opacity: 1 }}
                className="flex absolute right-2 top-1/2 z-10 justify-center items-center -mt-4 w-8 h-8 bg-white rounded-full"
                onClick={handleNext}
              >
                <ChevronRightIcon className="w-6 h-6" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  )
}
