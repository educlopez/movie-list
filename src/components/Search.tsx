"use client";

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { type SVGProps, useEffect, useRef, useState } from "react";
import { pathToSearchAll } from "@/utils";

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

interface SearchDialogProps {
  className?: string;
  onClose?: () => void;
  open: boolean;
  placeholder?: string;
  searchPath?: string;
  setOpen: (open: boolean) => void;
}

function SearchDialog({
  onClose: _onClose,
  open,
  setOpen,
  className,
  placeholder = "Search for Movies or TV Shows",
  searchPath,
}: SearchDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.length === 0) {
      return;
    }
    router.push(`${searchPath}${query.trim()}?page=1`);
    setQuery("");
  };

  // Close dialog on route change (replaces router.events which is removed in App Router)
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally only reacts to pathname changes
  useEffect(() => {
    if (open) {
      setOpen(false);
    }
  }, [pathname]);

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

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen]);

  return (
    <Transition show={open}>
      <Dialog
        className={clsx("fixed inset-0 z-50", className)}
        onClose={setOpen}
      >
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-400/25 backdrop-blur-sm dark:bg-black/40" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-20 md:py-32 lg:px-8 lg:py-[15vh]">
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="mx-auto overflow-hidden rounded-lg bg-zinc-50 shadow-xl ring-1 ring-zinc-900/7.5 sm:max-w-xl dark:bg-zinc-900 dark:ring-zinc-800">
              <div>
                <form onSubmit={handleSearch} ref={formRef}>
                  <div className="group relative flex h-12">
                    <SearchIcon className="pointer-events-none absolute top-0 left-3 h-full w-5 stroke-zinc-500" />
                    <input
                      className={clsx(
                        "flex-auto appearance-none bg-transparent pl-10 text-zinc-900 outline-none placeholder:text-zinc-500 focus:w-full focus:flex-none sm:text-sm dark:text-white [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden"
                      )}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setQuery(e.target.value)
                      }
                      placeholder={placeholder}
                      ref={inputRef}
                      value={query}
                    />
                  </div>
                </form>
              </div>
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

interface SearchComponentProps {
  searchPath?: string;
}

export function Search({ searchPath: _searchPath }: SearchComponentProps) {
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
      <SearchDialog
        className="hidden lg:block"
        {...dialogProps}
        searchPath={pathToSearchAll}
      />
    </div>
  );
}

interface MobileSearchProps {
  searchPath?: string;
}

export function MobileSearch({ searchPath: _searchPath }: MobileSearchProps) {
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
