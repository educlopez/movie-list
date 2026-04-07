"use client";

import type { TMDBWatchProvider } from "@/types/providers";
import ProviderLogo from "./ProviderLogo";

interface ProviderCategoryProps {
  providers: TMDBWatchProvider[];
  title: string;
  userPlatforms: number[];
}

export default function ProviderCategory({
  title,
  providers,
  userPlatforms,
}: ProviderCategoryProps) {
  if (providers.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <h4 className="mb-2 font-medium text-sm text-zinc-500 dark:text-zinc-400">
        {title}
      </h4>
      <div className="flex flex-wrap gap-3">
        {providers.map((provider) => (
          <ProviderLogo
            isUserPlatform={userPlatforms.includes(provider.provider_id)}
            key={provider.provider_id}
            provider={provider}
          />
        ))}
      </div>
    </div>
  );
}
