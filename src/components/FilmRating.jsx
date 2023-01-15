import Rating from 'react-rating';
import { StarIcon } from '@iconicicons/react';

export default function FilmRating({ number }) {
  return (
    <div className="flex flex-col items-center mb-6 text-center md:flex-row md:items-center md:text-left text-zinc-900 dark:text-white">
      <p className="mb-2 text-4xl font-medium md:mr-4 md:mb-0">{number}</p>
      <Rating
        className="flex self-center align-center"
        initialRating={number}
        emptySymbol={<StarIcon />}
        fullSymbol={<StarIcon className="text-amber-600 fill-amber-600" />}
        readonly
      />
    </div>
  );
}
