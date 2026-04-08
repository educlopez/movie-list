import { API_KEY, TMDB_ENDPOINT } from "@/utils";

// LRU cache for TMDB data (avoids duplicate API calls across requests)
const TMDB_CACHE_MAX = 500;
const TMDB_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface TmdbCacheEntry {
  poster_path: string | null;
  vote_average: number;
}

const cache = new Map<string, { data: TmdbCacheEntry; ts: number }>();

function get(key: string): TmdbCacheEntry | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < TMDB_CACHE_TTL) return entry.data;
  return null;
}

function set(key: string, data: TmdbCacheEntry) {
  if (cache.size >= TMDB_CACHE_MAX) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
  cache.set(key, { data, ts: Date.now() });
}

/**
 * Enrich items with TMDB poster and rating data.
 * Uses an in-memory LRU cache to avoid duplicate TMDB API calls.
 */
export async function enrichWithTmdb(
  items: Array<Record<string, unknown>>,
  maxItems = 50
) {
  const uniqueItems = new Map<string, Record<string, unknown>>();
  for (const item of items) {
    const key = `${item.media_type}-${item.id}`;
    if (item.id && !uniqueItems.has(key)) {
      uniqueItems.set(key, item);
    }
  }

  const fetches = Array.from(uniqueItems.values())
    .filter((item) => item.id && item.id !== 0)
    .slice(0, maxItems)
    .map(async (item) => {
      const cacheKey = `${item.media_type}-${item.id}`;
      const cached = get(cacheKey);
      if (cached) {
        item.poster_path = cached.poster_path || item.poster_path;
        item.vote_average = cached.vote_average || 0;
        return;
      }
      try {
        const res = await fetch(
          `${TMDB_ENDPOINT}/${item.media_type}/${item.id}?api_key=${API_KEY}`
        );
        if (res.ok) {
          const tmdb = await res.json();
          item.poster_path = tmdb.poster_path || item.poster_path;
          item.vote_average = tmdb.vote_average || 0;
          set(cacheKey, {
            poster_path: tmdb.poster_path,
            vote_average: tmdb.vote_average || 0,
          });
        }
      } catch {
        // Keep JustWatch data as fallback
      }
    });

  await Promise.allSettled(fetches);
}
