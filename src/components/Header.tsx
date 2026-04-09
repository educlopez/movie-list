"use client";

import clsx from "clsx";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { forwardRef, type ReactNode } from "react";
import { Logo } from "@/components/Logo";
import {
  MobileNavigation,
  useIsInsideMobileNavigation,
  useMobileNavigationStore,
} from "@/components/MobileNavigation";
import { ModeToggle } from "@/components/ModeToggle";
import { MobileSearch, Search } from "@/components/Search";
import AuthButton from "./AuthButton";
import NotificationBell from "./NotificationBell";
import PlatformSelector from "./PlatformSelector";

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
    <li>
      <Link
        className="text-sm text-zinc-600 leading-5 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        href={href}
        rel={rel}
        target={target}
      >
        {children}
      </Link>
    </li>
  );
}

interface HeaderProps {
  className?: string;
}

export const Header = forwardRef<HTMLDivElement, HeaderProps>(function Header(
  { className },
  ref
) {
  const { isOpen: mobileNavIsOpen } = useMobileNavigationStore();
  const isInsideMobileNavigation = useIsInsideMobileNavigation();

  const { scrollY } = useScroll();
  const bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9]);
  const bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8]);

  return (
    <motion.div
      className={clsx(
        className,
        "fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:z-30 lg:px-8",
        !isInsideMobileNavigation && "backdrop-blur-sm dark:backdrop-blur",
        isInsideMobileNavigation
          ? "bg-white dark:bg-zinc-900"
          : "bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]"
      )}
      ref={ref}
      style={
        {
          "--bg-opacity-light": bgOpacityLight,
          "--bg-opacity-dark": bgOpacityDark,
        } as React.CSSProperties
      }
    >
      <div
        className={clsx(
          "absolute inset-x-0 top-full h-px transition",
          (isInsideMobileNavigation || !mobileNavIsOpen) &&
            "bg-zinc-900/7.5 dark:bg-white/7.5"
        )}
      />
      <Link aria-label="Home" className="hidden lg:block" href="/">
        <Logo className="h-6" />
      </Link>
      <Search />
      <div className="flex items-center gap-5 lg:hidden">
        <MobileNavigation />
        <Link aria-label="Home" href="/">
          <Logo className="h-6" />
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
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
        <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15" />
        <div className="flex gap-4">
          <MobileSearch />
          <PlatformSelector />
          <ModeToggle />
          <NotificationBell />
          <AuthButton />
        </div>
      </div>
    </motion.div>
  );
});
