"use client";

import { useCallback, useEffect, useRef } from "react";
import useSWR from "swr";
import { authClient } from "@/lib/auth-client";
import { useWatchlist } from "@/stores/watchlist";
import { fetcher } from "@/utils";

interface WatchlistDbItem {
  id: number;
  userId: string;
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string;
  addedAt: string;
}

export function useAuthWatchlist() {
  const session = authClient.useSession();
  const localStore = useWatchlist();
  const hasMerged = useRef(false);

  const isLoggedIn = !!session.data?.user;

  const { data: dbItems, mutate } = useSWR<WatchlistDbItem[]>(
    isLoggedIn ? "/api/watchlist" : null,
    fetcher
  );

  // Merge localStorage items to DB on first login
  useEffect(() => {
    if (!isLoggedIn || hasMerged.current) return;
    hasMerged.current = true;

    const localItems = localStore.items;
    if (localItems.length > 0) {
      fetch("/api/watchlist/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localItems),
      }).then(() => mutate());
    }
  }, [isLoggedIn, localStore.items, mutate]);

  const addItem = useCallback(
    async (item: {
      id: number;
      media_type: "movie" | "tv";
      title: string;
      poster_path: string;
    }) => {
      if (!isLoggedIn) {
        localStore.toggleItem(item);
        return;
      }
      await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId: item.id,
          mediaType: item.media_type,
          title: item.title,
          posterPath: item.poster_path,
        }),
      });
      mutate();
    },
    [isLoggedIn, localStore, mutate]
  );

  const removeItem = useCallback(
    async (id: number, mediaType: "movie" | "tv") => {
      if (!isLoggedIn) {
        localStore.removeItem(id, mediaType);
        return;
      }
      await fetch("/api/watchlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tmdbId: id, mediaType }),
      });
      mutate();
    },
    [isLoggedIn, localStore, mutate]
  );

  const isInWatchlist = useCallback(
    (id: number, mediaType: "movie" | "tv") => {
      if (!isLoggedIn) {
        return localStore.isInWatchlist(id, mediaType);
      }
      return (dbItems ?? []).some(
        (item) => item.tmdbId === id && item.mediaType === mediaType
      );
    },
    [isLoggedIn, localStore, dbItems]
  );

  const toggleItem = useCallback(
    async (item: {
      id: number;
      media_type: "movie" | "tv";
      title: string;
      poster_path: string;
    }) => {
      if (isInWatchlist(item.id, item.media_type)) {
        await removeItem(item.id, item.media_type);
      } else {
        await addItem(item);
      }
    },
    [isInWatchlist, removeItem, addItem]
  );

  // Normalize items format for consumers
  const items = isLoggedIn
    ? (dbItems ?? []).map((i) => ({
        id: i.tmdbId,
        media_type: i.mediaType,
        title: i.title,
        poster_path: i.posterPath,
        added_at: new Date(i.addedAt).getTime(),
      }))
    : localStore.items;

  return { items, addItem, removeItem, isInWatchlist, toggleItem };
}
