"use client";

import useSWR from "swr";
import { useAuthPreferences } from "@/hooks/useAuthPreferences";
import type { WatchProvidersData } from "@/types/providers";
import { fetcher } from "@/utils";
import AlertButton from "./AlertButton";

interface AlertButtonWrapperProps {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string;
}

export default function AlertButtonWrapper({
  id,
  media_type,
  title,
  poster_path,
}: AlertButtonWrapperProps) {
  const { country, platforms } = useAuthPreferences();

  const { data } = useSWR<WatchProvidersData>(
    `/api/${media_type}/${id}/providers?country=${country}`,
    fetcher
  );

  // Check if the movie/show is available on any of the user's streaming platforms
  const isAvailableOnMyPlatforms =
    !!data &&
    data.flatrate.some((provider) =>
      platforms.includes(provider.provider_id)
    );

  return (
    <AlertButton
      id={id}
      isAvailableOnMyPlatforms={isAvailableOnMyPlatforms}
      media_type={media_type}
      poster_path={poster_path}
      title={title}
    />
  );
}
