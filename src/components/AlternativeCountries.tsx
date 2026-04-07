"use client";

import type { AlternativeCountry } from "@/types/providers";
import { getCountryName } from "@/utils/country";

interface AlternativeCountriesProps {
  alternatives: AlternativeCountry[];
  userCountry: string;
}

export default function AlternativeCountries({
  alternatives,
  userCountry,
}: AlternativeCountriesProps) {
  if (alternatives.length === 0) {
    return null;
  }

  const byProvider: Record<string, string[]> = {};
  for (const alt of alternatives) {
    for (const provider of alt.providers) {
      if (!byProvider[provider.provider_name]) {
        byProvider[provider.provider_name] = [];
      }
      byProvider[provider.provider_name].push(alt.country);
    }
  }

  return (
    <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-sm">
      <p className="mb-1 font-medium text-amber-700 dark:text-amber-400">
        No disponible en streaming en {getCountryName(userCountry)}
      </p>
      <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
        {Object.entries(byProvider)
          .slice(0, 5)
          .map(([providerName, countries]) => (
            <p key={providerName}>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {providerName}
              </span>{" "}
              en: {countries.slice(0, 8).join(", ")}
              {countries.length > 8 && ` +${countries.length - 8} más`}
            </p>
          ))}
      </div>
    </div>
  );
}
