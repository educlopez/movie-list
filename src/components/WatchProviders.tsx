"use client";

import useSWR from "swr";
import { usePreferences } from "@/stores/preferences";
import type { WatchProvidersData } from "@/types/providers";
import { fetcher } from "@/utils";
import AlternativeCountries from "./AlternativeCountries";
import ProviderCategory from "./ProviderCategory";

interface WatchProvidersProps {
  id: number;
  type: "movie" | "tv";
}

export default function WatchProviders({ id, type }: WatchProvidersProps) {
  const { country, platforms } = usePreferences();

  const { data, error } = useSWR<WatchProvidersData>(
    `/api/${type}/${id}/providers?country=${country}`,
    fetcher
  );

  if (error) {
    return null;
  }
  if (!data) {
    return (
      <div className="mb-6">
        <h3 className="mb-3 text-zinc-900 md:text-lg dark:text-white">
          Dónde ver
        </h3>
        <div className="h-20 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
      </div>
    );
  }

  const hasAny =
    data.flatrate.length > 0 || data.rent.length > 0 || data.buy.length > 0;

  if (!hasAny && data.alternatives.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="mb-3 text-zinc-900 md:text-lg dark:text-white">
          Dónde ver
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No hay información de disponibilidad
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-zinc-900 md:text-lg dark:text-white">
        Dónde ver
      </h3>
      <ProviderCategory
        providers={data.flatrate}
        title="Streaming"
        userPlatforms={platforms}
      />
      <ProviderCategory
        providers={data.rent}
        title="Alquilar"
        userPlatforms={platforms}
      />
      <ProviderCategory
        providers={data.buy}
        title="Comprar"
        userPlatforms={platforms}
      />
      {data.flatrate.length === 0 && data.alternatives.length > 0 && (
        <AlternativeCountries
          alternatives={data.alternatives}
          userCountry={country}
        />
      )}
      <p className="mt-3 text-[10px] text-zinc-400 dark:text-zinc-500">
        Datos de disponibilidad proporcionados por JustWatch
      </p>
    </div>
  );
}
