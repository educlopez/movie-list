import Head from 'next/head';
import MovieList from '@/components/MovieList';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { FilmIcon, MonitorIcon } from '@iconicicons/react';

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

      <Tab.Group as="div" defaultIndex={0}>
        {({ selectedIndex }) => (
          <>
            <Tab.List className="flex gap-4 px-0 mb-4">
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
            <Tab.Panels>
              <Tab.Panel>
                <MovieList
                  isHomePage
                  endpoint="/api/movie/now/1"
                  href="/movie/now/1"
                  limit={limitNormal}
                  title="Now playing"
                />
                <MovieList
                  isHomePage
                  endpoint="/api/movie/popular/1"
                  href="/movie/popular/1"
                  limit={limitNormal}
                  title="Popular"
                />
              </Tab.Panel>
              <Tab.Panel>
                <MovieList
                  isHomePage
                  endpoint="/api/tv/popular/1"
                  href="/tv/popular/1"
                  limit={limitNormal}
                  media_type="tv"
                  title="Popular"
                  type="tv series"
                />
              </Tab.Panel>
            </Tab.Panels>
          </>
        )}
      </Tab.Group>
    </>
  );
}
