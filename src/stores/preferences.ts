"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { detectCountry } from "@/utils/country";

interface PreferencesState {
  country: string;
  platforms: number[];
  setCountry: (country: string) => void;
  setPlatforms: (ids: number[]) => void;
  togglePlatform: (id: number) => void;
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set, get) => ({
      country: detectCountry(),
      platforms: [],
      setCountry: (country: string) => set({ country, platforms: [] }),
      togglePlatform: (id: number) => {
        const current = get().platforms;
        if (current.includes(id)) {
          set({ platforms: current.filter((p) => p !== id) });
        } else {
          set({ platforms: [...current, id] });
        }
      },
      setPlatforms: (ids: number[]) => set({ platforms: ids }),
    }),
    { name: "movielist-preferences" }
  )
);
