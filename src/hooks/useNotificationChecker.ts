"use client";

import { useCallback, useRef } from "react";
import useSWR from "swr";
import { authClient } from "@/lib/auth-client";
import type { JWProviderResults } from "@/types/tmdb";
import { fetcher } from "@/utils";

interface AlertDbItem {
  id: number;
  mediaType: "movie" | "tv";
  tmdbId: number;
}

export function useNotificationChecker() {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const lastCheckedRef = useRef<string>("");

  const { data: alerts } = useSWR<AlertDbItem[]>(
    isLoggedIn ? "/api/alerts" : null,
    fetcher
  );

  const checkProviders = useCallback(
    async (providerGroups: JWProviderResults[]) => {
      if (!(isLoggedIn && alerts) || alerts.length === 0) {
        return;
      }
      if (!providerGroups || providerGroups.length === 0) {
        return;
      }

      // Create a fingerprint to avoid re-checking the same data
      const fingerprint = providerGroups
        .map((pg) => `${pg.clearName}:${pg.items.length}`)
        .join(",");
      if (fingerprint === lastCheckedRef.current) {
        return;
      }
      lastCheckedRef.current = fingerprint;

      const alertSet = new Set(alerts.map((a) => `${a.tmdbId}-${a.mediaType}`));

      const matchedItems: Array<{
        tmdbId: number;
        mediaType: "movie" | "tv";
        title: string;
        posterPath: string;
        providerName: string;
        providerIcon?: string;
      }> = [];

      for (const pg of providerGroups) {
        for (const item of pg.items) {
          const key = `${item.id}-${item.media_type}`;
          if (alertSet.has(key)) {
            matchedItems.push({
              mediaType: item.media_type,
              posterPath: item.poster_path ?? "",
              providerIcon: pg.icon,
              providerName: pg.clearName,
              title: item.title,
              tmdbId: item.id,
            });
          }
        }
      }

      if (matchedItems.length === 0) {
        return;
      }

      await fetch("/api/notifications/check", {
        body: JSON.stringify({ items: matchedItems }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
    },
    [isLoggedIn, alerts]
  );

  return { checkProviders };
}
