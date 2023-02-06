export default function FilmHeading({ tagline, title }) {
  return (
    <div className="mt-6 mb-2 text-center md:mt-0 md:mb-4 md:text-left">
      <h1 className="mb-1 text-xl font-bold md:mb-3 md:text-3xl text-zinc-900 dark:text-white">
        {title}
      </h1>
      <h2 className="text-xs font-light text-app-placeholder sm:text-sm md:text-lg text-zinc-900 dark:text-white">
        {tagline}
      </h2>
    </div>
  )
}
