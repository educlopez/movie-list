import Image from "next/image";
import { shimmer, TMDB_IMAGE_ENDPOINT, toBase64 } from "@/utils";

interface FilmImageProps {
  src: string | null;
  title: string;
}

export default function FilmImage({ src, title }: FilmImageProps) {
  return (
    <section className="px-20 text-center md:pr-8 md:pl-0 lg:w-2/5">
      <Image
        alt={title}
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(350, 530))}`}
        className="rounded-lg"
        height={450}
        placeholder="blur"
        src={
          src === null
            ? "https://placehold.co/150x225"
            : `${TMDB_IMAGE_ENDPOINT}${src}`
        }
        unoptimized
        width={300}
      />
    </section>
  );
}
