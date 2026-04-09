"use client";

import { useCallback, useRef } from "react";
import useSWR from "swr";
import { authClient } from "@/lib/auth-client";
import type { JWProviderResults } from "@/types/tmdb";
import { fetcher } from "@/utils";

interface AlertDbItem {
  id: number;
  tmdbId: number;
  mediaType: "movie" | "tv";
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
      if (!isLoggedIn || !alerts || alerts.length === 0) return;
      if (!providerGroups || providerGroups.length === 0) return;

      // Create a fingerprint to avoid re-checking the same data
      const fingerprint = providerGroups
        .map((pg) => `${pg.clearName}:${pg.items.length}`)
        .join(",");
      if (fingerprint === lastCheckedRef.current) return;
      lastCheckedRef.current = fingerprint;

      const alertSet = new Set(
        alerts.map((a) => `${a.tmdbId}-${a.mediaType}`)
      );

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
              tmdbId: item.id,
              mediaType: item.media_type,
              title: item.title,
              posterPath: item.poster_path ?? "",
              providerName: pg.clearName,
              providerIcon: pg.icon,
            });
          }
        }
      }

      if (matchedItems.length === 0) return;

      await fetch("/api/notifications/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: matchedItems }),
      });
    },
    [isLoggedIn, alerts]
  );

  return { checkProviders };
}
