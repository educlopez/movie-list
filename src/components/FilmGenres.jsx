export default function FilmGenres({ genres }) {
  return (
    <div className="mb-6 text-zinc-900 dark:text-white">
      <h3 className="mb-2 md:text-lg">Genres</h3>
      <ul className="flex flex-wrap text-xs font-light md:text-sm">
        {renderGenres(genres)}
      </ul>
    </div>
  );
}

function renderGenres(arr) {
  if (arr.length !== 0) {
    return arr.map((genre) => {
      return (
        <li
          key={genre.id}
          className="flex items-center justify-center px-2 py-px mb-2 mr-2 font-medium text-center border-none rounded-md bg-app-pure-white text-app-dark-blue"
        >
          {genre.name}
        </li>
      );
    });
  } else {
    return 'N/A';
  }
}
