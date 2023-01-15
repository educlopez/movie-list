import { useRouter } from 'next/router';
import Image from 'next/image';
import { FilmIcon, MonitorIcon } from '@iconicicons/react';

export default function MovieCard({ id, category, rating, src, title, year }) {
  const router = useRouter();

  const handleClick = () => {
    if (category === 'movie') {
      router.push(`/movie/${id}`);
    } else if (category === 'tv') {
      router.push(`/tv/${id}`);
    }
  };

  return (
    <li className="relative flex flex-col items-start group ">
      <div onClick={handleClick} className="transition group-hover:scale-110">
        <Image
          src={src}
          alt={title}
          width={300}
          height={450}
          className="w-full rounded-md"
        />
        <p className="mt-1 text-center dark:text-zinc-400 text-zinc-600">
          {title}
        </p>
        <p className="mt-1 text-center dark:text-zinc-400 text-zinc-600">
          {renderYear(year)}
        </p>
        <p className="flex mt-1 text-center dark:text-zinc-400 text-zinc-600">
          {renderCategoryIcon(category)}
          <span className="pl-[6px] pr-[6px]">
            {renderCategoryText(category)}
          </span>
        </p>
      </div>
    </li>
  );
}

function renderYear(year) {
  if (!year) {
    return 'N/A';
  } else {
    return year.substring(0, 4);
  }
}

function renderCategoryIcon(category) {
  if (category === 'movie') {
    return <FilmIcon className="pl-1 text-base" />;
  } else {
    return <MonitorIcon className="pl-1 text-base" />;
  }
}

function renderCategoryText(category) {
  if (category === 'movie') {
    return 'Movie';
  } else {
    return 'TV Series';
  }
}

function renderRating(rating) {
  if (rating === true) {
    return '18+';
  } else {
    return 'E';
  }
}
