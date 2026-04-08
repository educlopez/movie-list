"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface TopLevelNavItemProps {
  children: ReactNode;
  href: string;
  rel?: string;
  target?: string;
}

function TopLevelNavItem({
  href,
  children,
  target,
  rel,
}: TopLevelNavItemProps) {
  return (
    <li className="md:hidden">
      <Link
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        href={href}
        rel={rel}
        target={target}
      >
        {children}
      </Link>
    </li>
  );
}

interface NavigationProps extends ComponentPropsWithoutRef<"nav"> {
  onClick?: () => void;
}

export function Navigation(props: NavigationProps) {
  return (
    <nav {...props}>
      <ul>
        <TopLevelNavItem href="/">Inicio</TopLevelNavItem>
        <TopLevelNavItem href="/new">Novedades</TopLevelNavItem>
        <TopLevelNavItem href="/watchlist">Mi Lista</TopLevelNavItem>
        <TopLevelNavItem
          href="https://github.com/educlopez/movie-list"
          rel="noopener noreferrer"
          target="_blank"
        >
          Github
        </TopLevelNavItem>
      </ul>
    </nav>
  );
}
