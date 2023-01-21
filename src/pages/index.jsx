import Head from 'next/head';
import MovieList from '@/components/MovieList';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { FilmIcon, MonitorIcon } from '@iconicicons/react';
import { motion } from 'framer-motion';
import { FADE_DOWN_ANIMATION_VARIANTS } from '@/lib/constants';

export default function Home() {
  const limitNormal = 10;
  const tabs = [
    { name: 'Movies', href: '#', icon: FilmIcon, current: true },
    { name: 'TV Shows', href: '#', icon: MonitorIcon, current: false }
  ];
  return (
    <>
      <Head>
        <title>Movielist</title>
        <meta
          name="description"
          content="Discover the latest movies and watch your favorites on Movielist - the ultimate movie search engine. Browse through our extensive selection and find the perfect film for you. Start watching now!"
        />
        <meta
          name="keywords"
          content="movies, watch, search, favorites, film, selection, Movielist"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <motion.h1
        className="text-4xl font-bold text-center text-zinc-900 dark:text-white sm:text-6xl"
        variants={FADE_DOWN_ANIMATION_VARIANTS}
      >
        Movie List
      </motion.h1>
      <motion.p
        className="mt-5 mb-10 text-center text-zinc-500 dark:text-white"
        variants={FADE_DOWN_ANIMATION_VARIANTS}
      >
        Made with Frame Motion, Nextjs and Tailwindcss
      </motion.p>
      <Tab.Group as="div" defaultIndex={0}>
        {({ selectedIndex }) => (
          <>
            <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
              <Tab.List className="flex justify-center gap-4 px-0 mb-4">
                {tabs.map((tab, featureIndex) => (
                  <Tab
                    className={clsx(
                      selectedIndex === featureIndex
                        ? 'border-emerald-400 text-emerald-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                      'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm mr-2'
                    )}
                    key={tab.name}
                  >
                    <tab.icon
                      className={clsx(
                        selectedIndex === featureIndex
                          ? 'text-emerald-400'
                          : 'text-gray-400 group-hover:text-gray-500',
                        '-ml-0.5 mr-2 h-5 w-5'
                      )}
                      aria-hidden="true"
                    />
                    {tab.name}
                  </Tab>
                ))}
              </Tab.List>
            </motion.div>
            <Tab.Panels>
              <Tab.Panel>
                <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
                  <MovieList
                    isHomePage
                    endpoint="/api/movie/now/1"
                    href="/movie/now/1"
                    limit={limitNormal}
                    title="Now playing"
                  />
                </motion.div>
                <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
                  <MovieList
                    isHomePage
                    endpoint="/api/movie/popular/1"
                    href="/movie/popular/1"
                    limit={limitNormal}
                    title="Popular"
                  />
                </motion.div>
              </Tab.Panel>
              <Tab.Panel>
                <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
                  <MovieList
                    isHomePage
                    endpoint="/api/tv/airing-today/1"
                    href="/tv/airing-today/1"
                    limit={limitNormal}
                    media_type="tv"
                    title="Airing Today"
                    type="TV Shows"
                  />
                </motion.div>
                <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
                  <MovieList
                    isHomePage
                    endpoint="/api/tv/popular/1"
                    href="/tv/popular/1"
                    limit={limitNormal}
                    media_type="tv"
                    title="Popular"
                    type="TV Shows"
                  />
                </motion.div>
              </Tab.Panel>
            </Tab.Panels>
          </>
        )}
      </Tab.Group>
    </>
  );
}
