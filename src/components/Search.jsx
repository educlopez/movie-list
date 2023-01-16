import {
  forwardRef,
  Fragment,
  useEffect,
  useId,
  useRef,
  useState
} from 'react';
import { useRouter } from 'next/router';
import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { pathToSearchAll } from '@/utils';
function SearchIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25"
      />
    </svg>
  );
}

function NoResultsIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.01 12a4.237 4.237 0 0 0 1.24-3c0-.62-.132-1.207-.37-1.738M12.01 12A4.237 4.237 0 0 1 9 13.25c-.635 0-1.237-.14-1.777-.388M12.01 12l3.24 3.25m-3.715-9.661a4.25 4.25 0 0 0-5.975 5.908M4.5 15.5l11-11"
      />
    </svg>
  );
}

function LoadingIcon(props) {
  let id = useId();

  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="5.5" strokeLinejoin="round" />
      <path
        stroke={`url(#${id})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.5 10a5.5 5.5 0 1 0-5.5 5.5"
      />
      <defs>
        <linearGradient
          id={id}
          x1="13"
          x2="9.5"
          y1="9"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function SearchButton(props) {
  let [modifierKey, setModifierKey] = useState();

  useEffect(() => {
    setModifierKey(
      /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? '⌘' : 'Ctrl '
    );
  }, []);

  return (
    <>
      <button
        type="button"
        className="hidden h-8 w-full items-center gap-2 rounded-full bg-white pl-2 pr-3 text-sm text-zinc-500 ring-1 ring-zinc-900/10 transition hover:ring-zinc-900/20 dark:bg-white/5 dark:text-zinc-400 dark:ring-inset dark:ring-white/10 dark:hover:ring-white/20 lg:flex focus:[&:not(:focus-visible)]:outline-none"
        {...props}
      >
        <SearchIcon className="w-5 h-5 stroke-current" />
        Find something...
        <kbd className="ml-auto text-2xs text-zinc-400 dark:text-zinc-500">
          <kbd className="font-sans">{modifierKey}</kbd>
          <kbd className="font-sans">K</kbd>
        </kbd>
      </button>
      <button
        type="button"
        className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5 lg:hidden focus:[&:not(:focus-visible)]:outline-none"
        aria-label="Find something..."
        {...props}
      >
        <SearchIcon className="w-5 h-5 stroke-zinc-900 dark:stroke-white" />
      </button>
    </>
  );
}

function SearchDialog({
  open,
  setOpen,
  className,
  placeholder = 'Search for movies or TV series',
  searchPath
}) {
  let router = useRouter();
  let formRef = useRef();
  let inputRef = useRef();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.length === 0) {
      return;
    } else {
      router.push(`${searchPath}${query.trim()}?page=1`);
      setQuery('');
    }
  };
  useEffect(() => {
    if (!open) {
      return;
    }

    function onRouteChange() {
      setOpen(false);
    }

    router.events.on('routeChangeStart', onRouteChange);
    router.events.on('hashChangeStart', onRouteChange);

    return () => {
      router.events.off('routeChangeStart', onRouteChange);
      router.events.off('hashChangeStart', onRouteChange);
    };
  }, [open, setOpen, router]);

  useEffect(() => {
    if (open) {
      return;
    }

    function onKeyDown(event) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, setOpen]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        onClose={setOpen}
        className={clsx('fixed inset-0 z-50', className)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-400/25 backdrop-blur-sm dark:bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:py-20 sm:px-6 md:py-32 lg:px-8 lg:py-[15vh]">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto overflow-hidden rounded-lg bg-zinc-50 shadow-xl ring-1 ring-zinc-900/7.5 dark:bg-zinc-900 dark:ring-zinc-800 sm:max-w-xl">
              <div>
                <form onSubmit={handleSearch} ref={formRef}>
                  <div className="relative flex h-12 group">
                    <SearchIcon className="absolute top-0 w-5 h-full pointer-events-none left-3 stroke-zinc-500" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={placeholder}
                      ref={inputRef}
                      onClose={() => setOpen(false)}
                      className={clsx(
                        'flex-auto appearance-none bg-transparent pl-10 text-zinc-900 outline-none placeholder:text-zinc-500 focus:w-full focus:flex-none dark:text-white sm:text-sm [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden'
                      )}
                      onKeyDown={(event) => {
                        if (event.key === 'Escape') {
                          onClose();
                        }
                      }}
                    />
                  </div>
                </form>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function useSearchProps() {
  let buttonRef = useRef();
  let [open, setOpen] = useState(false);

  return {
    buttonProps: {
      ref: buttonRef,
      onClick() {
        setOpen(true);
      }
    },
    dialogProps: {
      open,
      setOpen(open) {
        let { width, height } = buttonRef.current.getBoundingClientRect();
        if (!open || (width !== 0 && height !== 0)) {
          setOpen(open);
        }
      }
    }
  };
}

export function Search() {
  let [modifierKey, setModifierKey] = useState();
  let { buttonProps, dialogProps } = useSearchProps();

  useEffect(() => {
    setModifierKey(
      /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? '⌘' : 'Ctrl '
    );
  }, []);

  return (
    <div className="hidden lg:block lg:max-w-md lg:flex-auto">
      <button
        type="button"
        className="hidden h-8 w-full items-center gap-2 rounded-full bg-white pl-2 pr-3 text-sm text-zinc-500 ring-1 ring-zinc-900/10 transition hover:ring-zinc-900/20 dark:bg-white/5 dark:text-zinc-400 dark:ring-inset dark:ring-white/10 dark:hover:ring-white/20 lg:flex focus:[&:not(:focus-visible)]:outline-none"
        {...buttonProps}
      >
        <SearchIcon className="w-5 h-5 stroke-current" />
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

export function MobileSearch() {
  let { buttonProps, dialogProps } = useSearchProps();

  return (
    <div className="contents lg:hidden">
      <button
        type="button"
        className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5 lg:hidden focus:[&:not(:focus-visible)]:outline-none"
        aria-label="Find something..."
        {...buttonProps}
      >
        <SearchIcon className="w-5 h-5 stroke-zinc-900 dark:stroke-white" />
      </button>
      <SearchDialog className="lg:hidden" {...dialogProps} />
    </div>
  );
}
