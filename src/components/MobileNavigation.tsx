"use client";

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { motion } from "motion/react";
import { createContext, type SVGProps, useContext } from "react";
import { create } from "zustand";

import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      strokeLinecap="round"
      viewBox="0 0 10 9"
      {...props}
    >
      <path d="M.5 1h9M.5 8h9M.5 4.5h9" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      strokeLinecap="round"
      viewBox="0 0 10 9"
      {...props}
    >
      <path d="m1.5 1 7 7M8.5 1l-7 7" />
    </svg>
  );
}

const IsInsideMobileNavigationContext = createContext(false);

export function useIsInsideMobileNavigation() {
  return useContext(IsInsideMobileNavigationContext);
}

interface MobileNavigationState {
  close: () => void;
  isOpen: boolean;
  open: () => void;
  toggle: () => void;
}

export const useMobileNavigationStore = create<MobileNavigationState>(
  (set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  })
);

export function MobileNavigation() {
  const isInsideMobileNavigation = useIsInsideMobileNavigation();
  const { isOpen, toggle, close } = useMobileNavigationStore();
  const ToggleIcon = isOpen ? XIcon : MenuIcon;

  return (
    <IsInsideMobileNavigationContext.Provider value={true}>
      <button
        aria-label="Toggle navigation"
        className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
        onClick={toggle}
        type="button"
      >
        <ToggleIcon className="w-2.5 stroke-zinc-900 dark:stroke-white" />
      </button>
      {!isInsideMobileNavigation && (
        <Transition show={isOpen}>
          <Dialog className="fixed inset-0 z-50 lg:hidden" onClose={close}>
            <TransitionChild
              enter="duration-300 ease-out"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="duration-200 ease-in"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 top-14 bg-zinc-400/20 backdrop-blur-sm dark:bg-black/40" />
            </TransitionChild>

            <DialogPanel>
              <TransitionChild
                enter="duration-300 ease-out"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="duration-200 ease-in"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Header />
              </TransitionChild>

              <TransitionChild
                enter="duration-500 ease-in-out"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="duration-500 ease-in-out"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <motion.div
                  className="fixed top-14 bottom-0 left-0 w-full overflow-y-auto bg-white px-4 pt-6 pb-4 shadow-lg shadow-zinc-900/10 ring-1 ring-zinc-900/7.5 sm:px-6 sm:pb-10 min-[416px]:max-w-sm dark:bg-zinc-900 dark:ring-zinc-800"
                  layoutScroll
                >
                  <Navigation onClick={close} />
                </motion.div>
              </TransitionChild>
            </DialogPanel>
          </Dialog>
        </Transition>
      )}
    </IsInsideMobileNavigationContext.Provider>
  );
}
