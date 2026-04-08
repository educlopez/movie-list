interface FilmHeadingProps {
  children?: React.ReactNode;
  tagline: string;
  title: string;
}

export default function FilmHeading({
  children,
  tagline,
  title,
}: FilmHeadingProps) {
  return (
    <div className="mt-6 mb-2 text-center md:mt-0 md:mb-4 md:text-left">
      <div className="mb-1 flex flex-col items-center gap-2 md:mb-3 md:flex-row md:items-baseline md:gap-3">
        <h1 className="font-bold text-xl text-zinc-900 md:text-3xl dark:text-white">
          {title}
        </h1>
        {children}
      </div>
      <h2 className="font-light text-app-placeholder text-xs text-zinc-900 sm:text-sm md:text-lg dark:text-white">
        {tagline}
      </h2>
    </div>
  );
}
