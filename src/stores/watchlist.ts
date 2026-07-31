"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WatchlistItem {
  added_at: number;
  id: number;
  media_type: "movie" | "tv";
  poster_path: string;
  title: string;
}

interface WatchlistState {
  addItem: (item: Omit<WatchlistItem, "added_at">) => void;
  isInWatchlist: (id: number, media_type: "movie" | "tv") => boolean;
  items: WatchlistItem[];
  removeItem: (id: number, media_type: "movie" | "tv") => void;
  toggleItem: (item: Omit<WatchlistItem, "added_at">) => void;
}

export const useWatchlist = create<WatchlistState>()(
  persist(
    (set, get) => ({
      addItem: (item) =>
        set({
          items: [...get().items, { ...item, added_at: Date.now() }],
        }),
      isInWatchlist: (id, media_type) =>
        get().items.some((i) => i.id === id && i.media_type === media_type),
      items: [],
      removeItem: (id, media_type) =>
        set({
          items: get().items.filter(
            (i) => !(i.id === id && i.media_type === media_type)
          ),
        }),
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
