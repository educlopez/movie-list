import { useRef } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { motion, useIsPresent } from 'framer-motion'

import { remToPx } from '@/lib/remToPx'
import { Tag } from '@/components/Tag'

function useInitialValue(value, condition = true) {
  let initialValue = useRef(value).current
  return condition ? initialValue : value
}

function TopLevelNavItem({ href, children, target, rel }) {
  return (
    <li className="md:hidden">
      <Link
        href={href}
        className="block py-1 text-sm transition text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        target={target}
        rel={rel}
      >
        {children}
      </Link>
    </li>
  )
}

export function Navigation(props) {
  return (
    <nav {...props}>
      <ul role="list">
        <TopLevelNavItem href="/">Home</TopLevelNavItem>
        <TopLevelNavItem
          href="https://github.com/educlopez/movie-list"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </TopLevelNavItem>
      </ul>
    </nav>
  )
}
