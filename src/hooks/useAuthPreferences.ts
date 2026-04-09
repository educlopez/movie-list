"use client";

import { useCallback, useEffect, useRef } from "react";
import useSWR from "swr";
import { authClient } from "@/lib/auth-client";
import { usePreferences } from "@/stores/preferences";
import { fetcher } from "@/utils";

interface DbPreferences {
  country: string;
  platforms: number[];
}

export function useAuthPreferences() {
  const session = authClient.useSession();
  const localStore = usePreferences();
  const hasSynced = useRef(false);

  const isLoggedIn = !!session.data?.user;

  const { data: dbPrefs, mutate } = useSWR<DbPreferences>(
    isLoggedIn ? "/api/preferences" : null,
    fetcher
  );

  // On first login: if DB has prefs, load them into local store.
  // If DB is empty, push local prefs to DB.
  useEffect(() => {
    if (!isLoggedIn || hasSynced.current) return;
    if (dbPrefs === undefined) return; // still loading
    hasSynced.current = true;

    if (dbPrefs.country && dbPrefs.platforms.length > 0) {
      // DB has preferences -> apply to local store
      localStore.setCountry(dbPrefs.country);
      localStore.setPlatforms(dbPrefs.platforms);
    } else if (localStore.country || localStore.platforms.length > 0) {
      // Local has preferences, DB empty -> push to DB
      fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: localStore.country,
          platforms: localStore.platforms,
        }),
      });
    }
  }, [isLoggedIn, dbPrefs, localStore]);

  // Sync changes to DB when logged in
  const setCountry = useCallback(
    (country: string) => {
      localStore.setCountry(country);
      if (isLoggedIn) {
        fetch("/api/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country, platforms: localStore.platforms }),
        }).then(() => mutate());
      }
    },
    [isLoggedIn, localStore, mutate]
  );

  const togglePlatform = useCallback(
    (id: number) => {
      localStore.togglePlatform(id);
      if (isLoggedIn) {
        // Get updated platforms after toggle
        const current = localStore.platforms;
        const updated = current.includes(id)
          ? current.filter((p) => p !== id)
          : [...current, id];
        fetch("/api/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: localStore.country, platforms: updated }),
        }).then(() => mutate());
      }
    },
    [isLoggedIn, localStore, mutate]
  );

  const setPlatforms = useCallback(
    (ids: number[]) => {
      localStore.setPlatforms(ids);
      if (isLoggedIn) {
        fetch("/api/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: localStore.country, platforms: ids }),
        }).then(() => mutate());
      }
    },
    [isLoggedIn, localStore, mutate]
  );

  return {
    country: localStore.country,
    platforms: localStore.platforms,
    setCountry,
    togglePlatform,
    setPlatforms,
  };
}
