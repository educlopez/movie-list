"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WatchlistItem {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string;
  added_at: number;
}

interface WatchlistState {
  items: WatchlistItem[];
  addItem: (item: Omit<WatchlistItem, "added_at">) => void;
  removeItem: (id: number, media_type: "movie" | "tv") => void;
  isInWatchlist: (id: number, media_type: "movie" | "tv") => boolean;
  toggleItem: (item: Omit<WatchlistItem, "added_at">) => void;
}

export const useWatchlist = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set({
          items: [...get().items, { ...item, added_at: Date.now() }],
        }),
      removeItem: (id, media_type) =>
        set({
          items: get().items.filter(
            (i) => !(i.id === id && i.media_type === media_type)
          ),
        }),
      isInWatchlist: (id, media_type) =>
        get().items.some((i) => i.id === id && i.media_type === media_type),
      toggleItem: (item) => {
        const { isInWatchlist, addItem, removeItem } = get();
        if (isInWatchlist(item.id, item.media_type)) {
          removeItem(item.id, item.media_type);
        } else {
          addItem(item);
        }
      },
    }),
    { name: "movielist-watchlist" }
  )
);
