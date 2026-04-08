"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useSWRImmutable from "swr/immutable";
import { usePreferences } from "@/stores/preferences";
import type {
  JWDayResponse,
  JWPackage,
  JWPackagesResponse,
} from "@/types/tmdb";
import type { AvailablePlatformsData } from "@/types/providers";
import { fetcher } from "@/utils";
import CardSkeleton from "./CardSkeleton";
import TimelineGroup from "./TimelineGroup";

type MediaType = "all" | "movie" | "tv";
type Mode = "new" | "upcoming" | "deals";
type ProviderCategory =
  | "all"
  | "mine"
  | "flatrate"
  | "buy_rent"
  | "free"
  | "cinema";

function getDateLabel(dateStr: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000)
    .toISOString()
    .slice(0, 10);
  if (dateStr === today) return "Hoy";
  if (dateStr === yesterday) return "Ayer";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-ES", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDateOffset(baseDate: Date, offset: number): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

const PROVIDER_CATEGORIES: {
  key: ProviderCategory;
  label: string;
  filter: (p: JWPackage) => boolean;
}[] = [
  { key: "all", label: "Ver Todo", filter: () => true },
  { key: "mine", label: "Mis Servicios", filter: () => true },
  {
    key: "flatrate",
    label: "Suscripciones",
    filter: (p) => p.monetizationTypes?.includes("FLATRATE") ?? false,
  },
  {
    key: "buy_rent",
    label: "Comprar/Alquilar",
    filter: (p) =>
      (p.monetizationTypes?.includes("BUY") ||
        p.monetizationTypes?.includes("RENT")) ??
      false,
  },
  {
    key: "free",
    label: "Gratis",
    filter: (p) => p.monetizationTypes?.includes("FREE") ?? false,
  },
  {
    key: "cinema",
    label: "Cine",
    filter: (p) => p.monetizationTypes?.includes("CINEMA") ?? false,
  },
];

interface Filters {
  genre: string;
  rating: string;
  year: string;
  duration: string;
  ageRating: string;
}

const EMPTY_FILTERS: Filters = {
  genre: "",
  rating: "",
  year: "",
  duration: "",
  ageRating: "",
};

const MODE_TABS = [
  { key: "new" as const, label: "Estrenos" },
  { key: "upcoming" as const, label: "Proximamente" },
  { key: "deals" as const, label: "Ofertas" },
];

const MEDIA_TYPE_TABS = [
  { key: "all" as const, label: "Ver Todo" },
  { key: "movie" as const, label: "Peliculas" },
  { key: "tv" as const, label: "Series" },
];

export default function NewPageContent() {
  const [mediaType, setMediaType] = useState<MediaType>("all");
  const [mode, setMode] = useState<Mode>("new");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [providerCategory, setProviderCategory] =
    useState<ProviderCategory>("mine");
  const [days, setDays] = useState<JWDayResponse[]>([]);
  const [dayOffset, setDayOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showProviders, setShowProviders] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { country, platforms } = usePreferences();

  // Load JustWatch streaming packages for the country (immutable — rarely changes)
  const { data: packagesData } = useSWRImmutable<JWPackagesResponse>(
    `/api/justwatch/packages?country=${country}`,
    fetcher
  );

  // Load TMDB available platforms to map user-selected provider IDs to names (immutable)
  const { data: tmdbPlatformsData } = useSWRImmutable<AvailablePlatformsData>(
    platforms.length > 0
      ? `/api/providers?country=${country}&type=movie`
      : null,
    fetcher
  );

  const allJwPackages: JWPackage[] = packagesData?.allPackages || [];
  const streamingPackages: JWPackage[] = packagesData?.packages || [];

  // Build set of selected provider names from TMDB data
  const selectedProviderNames = useMemo(() => {
    if (platforms.length === 0 || !tmdbPlatformsData) return null;
    const selected = tmdbPlatformsData.platforms.filter((p) =>
      platforms.includes(p.provider_id)
    );
    return new Set(selected.map((p) => p.provider_name.toLowerCase()));
  }, [platforms, tmdbPlatformsData]);

  // User's selected JW packages
  const myPackages = useMemo(() => {
    if (!selectedProviderNames) return streamingPackages;
    return streamingPackages.filter((p) =>
      selectedProviderNames.has(p.clearName.toLowerCase())
    );
  }, [streamingPackages, selectedProviderNames]);

  // Packages filtered by the current provider category
  const categoryPackages = useMemo(() => {
    if (providerCategory === "mine") return myPackages;
    if (providerCategory === "all") return allJwPackages;
    const cat = PROVIDER_CATEGORIES.find((c) => c.key === providerCategory);
    return cat ? allJwPackages.filter(cat.filter) : allJwPackages;
  }, [providerCategory, allJwPackages, myPackages]);

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of PROVIDER_CATEGORIES) {
      if (cat.key === "mine") {
        counts[cat.key] = myPackages.length;
      } else if (cat.key === "all") {
        counts[cat.key] = allJwPackages.length;
      } else {
        counts[cat.key] = allJwPackages.filter(cat.filter).length;
      }
    }
    return counts;
  }, [allJwPackages, myPackages]);

  // Visible packages for the provider stack icon
  const stackIcons = myPackages.slice(0, 4);

  // Active provider shortNames for filtering API results
  const activeProviderNames = useMemo(() => {
    if (selectedPackage) return null; // Single package selected, API handles it
    if (providerCategory === "all") return null; // Show everything
    const pkgs =
      providerCategory === "mine" ? myPackages : categoryPackages;
    return new Set(pkgs.map((p) => p.clearName.toLowerCase()));
  }, [selectedPackage, providerCategory, myPackages, categoryPackages]);

  const fetchDay = useCallback(
    async (offset: number) => {
      // For upcoming mode, use the dedicated upcoming endpoint (no per-day pagination)
      if (mode === "upcoming") {
        const params = new URLSearchParams({ country });
        const res = await fetch(`/api/justwatch/upcoming?${params.toString()}`);
        const data: JWDayResponse = await res.json();

        let filteredProviders = data.providers;

        if (activeProviderNames) {
          filteredProviders = filteredProviders.filter((p) =>
            activeProviderNames.has(p.clearName.toLowerCase())
          );
        }

        if (mediaType !== "all") {
          filteredProviders = filteredProviders
            .map((p) => ({
              ...p,
              items: p.items.filter((item) => item.media_type === mediaType),
            }))
            .filter((p) => p.items.length > 0);
        }

        return { ...data, providers: filteredProviders };
      }

      const date = getDateOffset(new Date(), -offset);

      const params = new URLSearchParams({ date, country });

      if (selectedPackage) {
        params.set("packages", selectedPackage);
      }
      if (mode === "deals") {
        params.set("monetization", "BUY,RENT");
      }

      const res = await fetch(`/api/justwatch/new?${params.toString()}`);
      const data: JWDayResponse = await res.json();

      let filteredProviders = data.providers;

      // Filter by active providers (category or user selection)
      if (activeProviderNames) {
        filteredProviders = filteredProviders.filter((p) =>
          activeProviderNames.has(p.clearName.toLowerCase())
        );
      }

      // Client-side media type filter
      if (mediaType !== "all") {
        filteredProviders = filteredProviders
          .map((p) => ({
            ...p,
            items: p.items.filter((item) => item.media_type === mediaType),
          }))
          .filter((p) => p.items.length > 0);
      }

      return { ...data, providers: filteredProviders };
    },
    [mediaType, mode, country, selectedPackage, activeProviderNames]
  );

  // Load initial 3 days
  useEffect(() => {
    let cancelled = false;
    setDays([]);
    setDayOffset(0);
    setHasMore(true);
    setIsLoading(true);

    (async () => {
      const results: JWDayResponse[] = [];
      if (mode === "upcoming") {
        // Upcoming mode returns all results in one call
        const day = await fetchDay(0);
        if (cancelled) return;
        if (day.providers?.length > 0) results.push(day);
        setDays(results);
        setDayOffset(1);
        setHasMore(false);
      } else {
        // Fetch 3 days in parallel to avoid waterfall
        const dayResults = await Promise.all([
          fetchDay(0),
          fetchDay(1),
          fetchDay(2),
        ]);
        if (cancelled) return;
        for (const day of dayResults) {
          if (day.providers?.length > 0) results.push(day);
        }
        setDays(results);
        setDayOffset(3);
        if (results.length === 0) setHasMore(false);
      }
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchDay, mode]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    let found = false;
    let offset = dayOffset;
    for (let attempt = 0; attempt < 5; attempt++) {
      const day = await fetchDay(offset);
      offset++;
      if (day.providers?.length > 0) {
        setDays((prev) => [...prev, day]);
        found = true;
        break;
      }
    }

    setDayOffset(offset);
    if (!found || offset > 30) setHasMore(false);
    setIsLoading(false);
  }, [isLoading, hasMore, dayOffset, fetchDay]);

  // Infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "300px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const hasActiveFilters = Object.values(filters).some(Boolean);
  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-4">
      {/* Row 1: Mode tabs */}
      <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-700">
        {MODE_TABS.map(({ key, label }) => (
          <button
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              mode === key
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
            key={key}
            onClick={() => setMode(key)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Row 2: Media type pills + Provider stack + Filters button */}
      <div className="flex items-center justify-between gap-4">
        {/* Media type pills */}
        <div className="flex items-center rounded-full bg-zinc-100 p-1 dark:bg-zinc-800">
          {MEDIA_TYPE_TABS.map(({ key, label }) => (
            <button
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                mediaType === key
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
              key={key}
              onClick={() => setMediaType(key)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right side: Provider stack + Filters */}
        <div className="flex items-center gap-3">
          {/* Provider icon stack */}
          {stackIcons.length > 0 && (
            <button
              className={`relative flex items-center rounded-lg px-2 py-1.5 transition-colors ${
                showProviders
                  ? "bg-emerald-500/10 ring-2 ring-emerald-500"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              onClick={() => {
                setShowProviders(!showProviders);
                if (!showProviders) setShowFilters(false);
              }}
              type="button"
            >
              <div className="flex -space-x-1.5">
                {stackIcons.map((p) => (
                  <Image
                    alt={p.clearName}
                    className="rounded ring-2 ring-white dark:ring-zinc-900"
                    height={28}
                    key={p.shortName}
                    src={p.icon}
                    unoptimized
                    width={28}
                  />
                ))}
              </div>
              {myPackages.length > 4 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white">
                  {myPackages.length}
                </span>
              )}
            </button>
          )}

          {/* Filters button */}
          <button
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
              showFilters || hasActiveFilters
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
            }`}
            onClick={() => {
              setShowFilters(!showFilters);
              if (!showFilters) setShowProviders(false);
            }}
            type="button"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Filtros
            {hasActiveFilters && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expandable provider panel */}
      {showProviders && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          {/* Provider category tabs */}
          <div className="scrollbar-none mb-3 flex items-center gap-2 overflow-x-auto">
            {PROVIDER_CATEGORIES.map((cat) => {
              const count = categoryCounts[cat.key] || 0;
              if (count === 0 && cat.key !== "all" && cat.key !== "mine")
                return null;
              return (
                <button
                  className={`flex-none rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    providerCategory === cat.key
                      ? "bg-emerald-500 text-white"
                      : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                  }`}
                  key={cat.key}
                  onClick={() => {
                    setProviderCategory(cat.key);
                    setSelectedPackage(null);
                  }}
                  type="button"
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Provider icons grid */}
          <div className="flex flex-wrap items-center gap-2">
            {categoryPackages.map((p) => (
              <button
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-all ${
                  selectedPackage === p.shortName
                    ? "bg-emerald-500/10 ring-2 ring-emerald-500"
                    : "bg-white hover:bg-zinc-100 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                }`}
                key={p.shortName}
                onClick={() =>
                  setSelectedPackage(
                    selectedPackage === p.shortName ? null : p.shortName
                  )
                }
                type="button"
              >
                {p.icon && (
                  <Image
                    alt={p.clearName}
                    className="rounded"
                    height={24}
                    src={p.icon}
                    unoptimized
                    width={24}
                  />
                )}
                <span className="font-medium text-xs text-zinc-700 dark:text-zinc-300">
                  {p.clearName}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Expandable filters panel */}
      {showFilters && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <div className="flex flex-wrap items-center gap-3">
            <FilterSelect
              label="Generos"
              onChange={(v) => setFilters({ ...filters, genre: v })}
              value={filters.genre}
            />
            <FilterSelect
              label="Ano de estreno"
              onChange={(v) => setFilters({ ...filters, year: v })}
              options={years.map((y) => ({
                value: y.toString(),
                label: y.toString(),
              }))}
              value={filters.year}
            />
            <FilterSelect
              label="Calificacion"
              onChange={(v) => setFilters({ ...filters, rating: v })}
              options={[
                { value: "7", label: "7+" },
                { value: "6", label: "6+" },
                { value: "5", label: "5+" },
              ]}
              value={filters.rating}
            />
            <FilterSelect
              label="Duracion"
              onChange={(v) => setFilters({ ...filters, duration: v })}
              options={[
                { value: "short", label: "< 1h" },
                { value: "medium", label: "1-2h" },
                { value: "long", label: "> 2h" },
              ]}
              value={filters.duration}
            />
            <FilterSelect
              label="Clasificacion"
              onChange={(v) => setFilters({ ...filters, ageRating: v })}
              options={[
                { value: "all", label: "Todos los publicos" },
                { value: "7", label: "+7" },
                { value: "12", label: "+12" },
                { value: "16", label: "+16" },
                { value: "18", label: "+18" },
              ]}
              value={filters.ageRating}
            />
            {hasActiveFilters && (
              <button
                className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                onClick={() => setFilters(EMPTY_FILTERS)}
                type="button"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Reinicializar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      {days.length === 0 && isLoading && (
        <div className="space-y-8">
          <CardSkeleton count={8} />
          <CardSkeleton count={8} />
        </div>
      )}

      {days.map((day, i) => {
        const totalItems = day.providers.reduce(
          (sum, pg) => sum + pg.items.length,
          0
        );
        return (
          <TimelineGroup
            date={day.date}
            isLast={i === days.length - 1 && !hasMore}
            key={day.date}
            label={getDateLabel(day.date)}
            providerGroups={day.providers}
            totalItems={totalItems}
          />
        );
      })}

      {days.length > 0 && !hasMore && (
        <p className="pl-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          No hay mas resultados
        </p>
      )}

      <div className="h-1" ref={sentinelRef} />

      {isLoading && days.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      )}
    </div>
  );
}

/** Reusable dropdown filter with chevron, styled like JustWatch */
function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  onChange: (value: string) => void;
  options?: { label: string; value: string }[];
  value: string;
}) {
  // Genre options are fetched dynamically if no options provided (immutable)
  const { data: genreData } = useSWRImmutable(
    !options ? "/api/genres?type=movie" : null,
    fetcher
  );

  const resolvedOptions = options
    ? options
    : ((genreData as { genres?: { id: number; name: string }[] })?.genres || []).map(
        (g) => ({ value: g.id.toString(), label: g.name })
      );

  return (
    <div className="relative">
      <select
        className={`appearance-none rounded-lg border bg-white py-1.5 pr-7 pl-3 text-sm font-medium transition-colors ${
          value
            ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
            : "border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
        } dark:bg-zinc-800`}
        onChange={(e) => onChange(e.target.value)}
        value={value}
      >
        <option value="">{label}</option>
        {resolvedOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          d="M19 9l-7 7-7-7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
