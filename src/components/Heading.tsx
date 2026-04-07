import Link from "next/link";

export interface HeadingProps {
  href: string;
  isHomePage?: boolean;
  isTrending?: boolean;
  media_type?: string;
  title: string;
}

export default function Heading({
  href,
  isHomePage,
  media_type: _media_type,
  title,
}: HeadingProps) {
  return (
    <div className="mb-4 flex items-end justify-between text-zinc-900 sm:mb-6 dark:text-white">
      {isHomePage ? (
        <div className="flex items-end">
          <h2 className="section-title py-px sm:py-0">{title}</h2>
        </div>
      ) : (
        <h2 className="section-title">{title}</h2>
      )}
      <Link as={href} href={href} passHref>
        <div className="cursor-pointer font-medium text-app-greyish-blue text-xs uppercase tracking-wide hover:underline">
          See more
        </div>
      </Link>
    </div>
  );
}
