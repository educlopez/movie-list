import Link from 'next/link'

export default function Heading({ href, isHomePage, media_type, title }) {
  return (
    <div className="flex items-end justify-between mb-4 sm:mb-6 text-zinc-900 dark:text-white">
      {isHomePage ? (
        <div className="flex items-end">
          <h2 className="py-px section-title sm:py-0">{title}</h2>
        </div>
      ) : (
        <h2 className="section-title">{title}</h2>
      )}
      <Link href={href} as={href} passHref>
        <div className="text-xs font-medium tracking-wide uppercase cursor-pointer text-app-greyish-blue hover:underline">
          See more
        </div>
      </Link>
    </div>
  )
}
