"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { FilmIcon, MonitorIcon } from "@iconicicons/react";
import clsx from "clsx";
import { motion } from "motion/react";
import CarouselList from "@/components/CarouselList";
import MovieList from "@/components/MovieList";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";

interface TabItem {
  current: boolean;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  name: string;
}

export default function Home(): React.JSX.Element {
  const limitNormal = 14;
  const limitSlide = 4;
  const tabs: TabItem[] = [
    { name: "Movies", href: "#", icon: FilmIcon, current: true },
    { name: "TV Shows", href: "#", icon: MonitorIcon, current: false },
  ];
  return (
    <>
      <motion.h1
        className="text-center font-bold text-4xl text-zinc-900 sm:text-6xl dark:text-white"
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
      <div className="flex flex-row justify-center gap-10">
        <div className="flex h-full w-2/4 flex-col">
          <CarouselList
            endpoint="/api/movie/now/1"
            href="/movie/now/1"
            isHomePage
            limit={limitSlide}
            title="Now playing"
          />
        </div>
        <div className="flex h-full w-2/4 flex-col">
          <CarouselList
            endpoint="/api/tv/airing-today/1"
            href="/tv/airing-today/1"
            isHomePage
            limit={limitSlide}
            title="Airing Today"
          />
        </div>
      </div>
      <TabGroup as="div" defaultIndex={0}>
        {({ selectedIndex }) => (
          <>
            <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
              <TabList className="mb-4 flex justify-center gap-4 px-0">
                {tabs.map((tab, featureIndex) => (
                  <Tab
                    className={clsx(
                      selectedIndex === featureIndex
                        ? "border-emerald-400 text-emerald-400"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                      "group mr-2 inline-flex items-center border-b-2 px-1 py-4 font-medium text-sm"
                    )}
                    key={tab.name}
                  >
                    <tab.icon
                      aria-hidden="true"
                      className={clsx(
                        selectedIndex === featureIndex
                          ? "text-emerald-400"
                          : "text-gray-400 group-hover:text-gray-500",
                        "mr-2 -ml-0.5 h-5 w-5"
                      )}
                    />
                    {tab.name}
                  </Tab>
                ))}
              </TabList>
            </motion.div>
            <TabPanels>
              <TabPanel>
                <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
                  <MovieList
                    endpoint="/api/movie/now/1"
                    href="/movie/now/1"
                    isHomePage
                    limit={limitNormal}
                    title="Now playing"
                  />
                </motion.div>
                <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
                  <MovieList
                    endpoint="/api/movie/popular/1"
                    href="/movie/popular/1"
                    isHomePage
                    limit={limitNormal}
                    title="Popular"
                  />
                </motion.div>
              </TabPanel>
              <TabPanel>
                <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
                  <MovieList
                    endpoint="/api/tv/airing-today/1"
                    href="/tv/airing-today/1"
                    isHomePage
                    limit={limitNormal}
                    media_type="tv"
                    title="Airing Today"
                    type="TV Shows"
                  />
                </motion.div>
                <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
                  <MovieList
                    endpoint="/api/tv/top/1"
                    href="/tv/top/1"
                    isHomePage
                    limit={limitNormal}
                    media_type="tv"
                    title="Top Rated"
                    type="TV Shows"
                  />
                </motion.div>
              </TabPanel>
            </TabPanels>
          </>
        )}
      </TabGroup>
    </>
  );
}
