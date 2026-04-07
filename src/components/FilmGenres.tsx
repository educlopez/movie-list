import type { ReactNode } from "react";

interface Genre {
  id: number;
  name: string;
}

interface FilmGenresProps {
  genres: Genre[];
}

export default function FilmGenres({ genres }: FilmGenresProps) {
  return (
    <div className="mb-6 text-zinc-900 dark:text-white">
      <h3 className="mb-2 md:text-lg">Genres</h3>
      <ul className="flex flex-wrap font-light text-xs md:text-sm">
        {renderGenres(genres)}
      </ul>
    </div>
  );
}

function renderGenres(arr: Genre[]): ReactNode {
  if (arr.length === 0) {
    return "N/A";
  }
  return arr.map((genre) => {
    return (
      <li
        className="mr-2 mb-2 flex items-center justify-center rounded-md border-none bg-app-pure-white px-2 py-px text-center font-medium text-app-dark-blue"
        key={genre.id}
      >
        {genre.name}
      </li>
    );
  });
}
