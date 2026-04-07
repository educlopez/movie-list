interface FilmHeadingProps {
  tagline: string;
  title: string;
}

export default function FilmHeading({ tagline, title }: FilmHeadingProps) {
  return (
    <div className="mt-6 mb-2 text-center md:mt-0 md:mb-4 md:text-left">
      <h1 className="mb-1 font-bold text-xl text-zinc-900 md:mb-3 md:text-3xl dark:text-white">
        {title}
      </h1>
      <h2 className="font-light text-app-placeholder text-xs text-zinc-900 sm:text-sm md:text-lg dark:text-white">
        {tagline}
      </h2>
    </div>
  );
}
