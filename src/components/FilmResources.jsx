import { LinkIcon, WorldIcon } from '@iconicicons/react';

export default function FilmResources({ website, imdb, trailer }) {
  return (
    <div className="flex flex-wrap mb-10">
      {website === '' || website === undefined ? null : (
        <a
          href={website}
          className="flex items-center justify-between w-40 px-8 py-3 mb-4 mr-4 text-sm font-medium border-none rounded-md cursor-pointer bg-app-greyish-blue text-app-pure-white hover:bg-app-pure-white hover:text-app-dark-blue"
          target="_blank"
          rel="noreferrer"
        >
          <p>Website</p>
          <LinkIcon className="text-base" />
        </a>
      )}
      {!imdb ? null : (
        <a
          href={`https://www.imdb.com/title/${imdb}`}
          className="flex items-center justify-between w-40 px-8 py-3 mb-4 text-sm font-medium border-none rounded-md cursor-pointer bg-app-greyish-blue text-app-pure-white hover:bg-app-pure-white hover:text-app-dark-blue"
          target="_blank"
          rel="noreferrer"
        >
          <p>IMDB</p>
          <WorldIcon className="text-base" />
        </a>
      )}
      {/* <a
        href={trailer}
        className="flex items-center justify-between w-full px-8 py-4 mb-4 text-sm font-medium border-none rounded-md cursor-pointer bg-app-semi-dark-blue text-app-pure-white hover:bg-app-greyish-blue">
        <p>Trailer</p>

      </a> */}
    </div>
  );
}
