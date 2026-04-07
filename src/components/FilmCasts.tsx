import Image from "next/image";
import type { ReactNode } from "react";
import type { TMDBCastMember } from "@/types";
import { shimmer, TMDB_IMAGE_CAST_ENDPOINT, toBase64 } from "@/utils";

interface FilmCastsProps {
  casts: TMDBCastMember[];
}

export default function FilmCasts({ casts }: FilmCastsProps) {
  return (
    <div className="mb-10 w-full text-zinc-900 dark:text-white">
      <h3 className="mb-2 md:text-lg">Top Billed Cast</h3>
      <ul className="y-scroll relative flex touch-pan-y gap-x-6 overflow-x-auto text-xs md:text-sm">
        {renderCasts(casts)}
      </ul>
    </div>
  );
}

function renderCasts(arr: TMDBCastMember[]): ReactNode {
  if (Array.isArray(arr) && arr.length !== 0) {
    return arr.map((cast) => {
      return (
        <li
          className="flex-none rounded-2xl border border-zinc-900/10 bg-white/10 backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/20 dark:backdrop-blur"
          key={cast.credit_id}
        >
          <div className="flex w-full flex-col items-center justify-center gap-3 pb-2">
            <Image
              alt={cast.name}
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer(350, 530)
              )}`}
              className="rounded-lg"
              height={225}
              placeholder="blur"
              src={
                cast.profile_path
                  ? `${TMDB_IMAGE_CAST_ENDPOINT}${cast.profile_path}`
                  : "https://placehold.co/150x225"
              }
              unoptimized
              width={150}
            />
            <span className="mx-auto px-2 text-center text-xs text-zinc-900 lg:text-sm dark:text-white">
              <p className="font-bold">{cast.name}</p>
              <p className="w-32 truncate">{cast.character}</p>
            </span>
          </div>
        </li>
      );
    });
  }
  return "N/A";
}
