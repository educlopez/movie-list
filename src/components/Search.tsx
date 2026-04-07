"use client";

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type SVGProps, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import type { TMDBSearchResponse } from "@/types/tmdb";
import { fetcher, TMDB_IMAGE_THUMB_ENDPOINT } from "@/utils";
import RatingBadge from "./RatingBadge";

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20" {...props}>
      <path
        d="M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function SearchResults({
  query,
  onSelect,
}: {
  query: string;
  onSelect: () => void;
}) {
  const debouncedQuery = useDebounce(query, 300);
  const { data, error } = useSWR<TMDBSearchResponse>(
    debouncedQuery.length >= 2
      ? `/api/search?q=${encodeURIComponent(debouncedQuery)}`
      : null,
    fetcher
  );

  if (debouncedQuery.length < 2) {
    return null;
  }

  if (!(data || error)) {
    return (
      <div className="space-y-2 p-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            className="flex animate-pulse gap-3 rounded-lg p-2"
            key={`skel-${i.toString()}`}
          >
            <div className="h-[60px] w-[40px] rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="p-4 text-red-500 text-sm">Error loading results</p>;
  }

  const results =
    data?.results
      ?.filter((r) => r.media_type === "movie" || r.media_type === "tv")
      .slice(0, 8) || [];

  if (results.length === 0) {
    return (
      <p className="p-4 text-sm text-zinc-500 dark:text-zinc-400">
        No results for &ldquo;{debouncedQuery}&rdquo;
      </p>
    );
  }

  return (
    <ul className="max-h-[60vh] overflow-y-auto p-2">
      {results.map((item) => {
        const title =
          item.title || item.original_name || item.original_title || "";
        const year = (item.release_date || item.first_air_date || "").slice(
          0,
          4
        );
        const href = `/${item.media_type}/${item.id}`;
        return (
          <li key={`${item.media_type}-${item.id}`}>
            <Link
              className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              href={href}
              onClick={onSelect}
            >
              <div className="relative h-[60px] w-[40px] flex-none overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800">
                {item.poster_path ? (
                  <Image
                    alt={title}
                    className="object-cover"
                    fill
                    src={`${TMDB_IMAGE_THUMB_ENDPOINT}${item.poster_path}`}
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4 text-zinc-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-sm text-zinc-900 dark:text-white">
                  {title}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  {year && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {year}
                    </span>
                  )}
                  <span className="font-medium text-[10px] text-zinc-400 uppercase dark:text-zinc-500">
                    {item.media_type === "tv" ? "TV" : "Movie"}
                  </span>
                </div>
              </div>
              {item.vote_average !== undefined && item.vote_average > 0 && (
                <RatingBadge rating={item.vote_average} size="sm" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SearchDialog({
  open,
  setOpen,
  className,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const pathname = usePathname();

  // Close on route change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally only reacts to pathname changes
  useEffect(() => {
    if (open) {
      setOpen(false);
      setQuery("");
    }
  }, [pathname]);

  // ⌘K shortcut
  useEffect(() => {
    if (open) {
      return;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  return (
    <Transition show={open}>
      <Dialog
        className={`fixed inset-0 z-50 ${className || ""}`}
        onClose={() => {
          setOpen(false);
          setQuery("");
        }}
      >
        <TransitionChild
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-20 md:py-32 lg:px-8 lg:py-[15vh]">
          <TransitionChild
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="mx-auto overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-900/10 sm:max-w-xl dark:bg-zinc-900 dark:ring-zinc-800">
              {/* Search input */}
              <div className="flex items-center gap-3 border-zinc-200 border-b px-4 dark:border-zinc-800">
                <SearchIcon className="h-5 w-5 shrink-0 stroke-zinc-500" />
                <input
                  className="h-12 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white"
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search movies and TV shows..."
                  ref={inputRef}
                  value={query}
                />
                {query && (
                  <button
                    className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    onClick={() => setQuery("")}
                    type="button"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Live results */}
              <SearchResults
                onSelect={() => {
                  setOpen(false);
                  setQuery("");
                }}
                query={query}
              />

              {/* Footer hint */}
              {query.length === 0 && (
                <div className="border-zinc-200 border-t px-4 py-3 dark:border-zinc-800">
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Type at least 2 characters to search
                  </p>
                </div>
              )}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}

function useSearchProps() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  return {
    buttonProps: {
      ref: buttonRef,
      onClick() {
        setOpen(true);
      },
    },
    dialogProps: {
      open,
      setOpen(open: boolean) {
        const { width = 0, height = 0 } =
          buttonRef.current?.getBoundingClientRect() ?? {};
        if (!open || (width !== 0 && height !== 0)) {
          setOpen(open);
        }
      },
    },
  };
}

export function Search() {
  const [modifierKey, setModifierKey] = useState<string>();
  const { buttonProps, dialogProps } = useSearchProps();

  useEffect(() => {
    setModifierKey(
      /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? "⌘" : "Ctrl "
    );
  }, []);

  return (
    <div className="hidden lg:block lg:max-w-md lg:flex-auto">
      <button
        className="hidden h-8 w-full items-center gap-2 rounded-full bg-white pr-3 pl-2 text-sm text-zinc-500 ring-1 ring-zinc-900/10 transition hover:ring-zinc-900/20 lg:flex dark:bg-white/5 dark:text-zinc-400 dark:ring-white/10 dark:ring-inset dark:hover:ring-white/20 focus:[&:not(:focus-visible)]:outline-none"
        type="button"
        {...buttonProps}
      >
        <SearchIcon className="h-5 w-5 stroke-current" />
        Find something...
        <kbd className="ml-auto text-2xs text-zinc-400 dark:text-zinc-500">
          <kbd className="font-sans">{modifierKey}</kbd>
          <kbd className="font-sans">K</kbd>
        </kbd>
      </button>
      <SearchDialog className="hidden lg:block" {...dialogProps} />
    </div>
  );
}

export function MobileSearch() {
  const { buttonProps, dialogProps } = useSearchProps();

  return (
    <div className="contents lg:hidden">
      <button
        aria-label="Find something..."
        className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 lg:hidden dark:hover:bg-white/5 focus:[&:not(:focus-visible)]:outline-none"
        type="button"
        {...buttonProps}
      >
        <SearchIcon className="h-5 w-5 stroke-zinc-900 dark:stroke-white" />
      </button>
      <SearchDialog className="lg:hidden" {...dialogProps} />
    </div>
  );
}
