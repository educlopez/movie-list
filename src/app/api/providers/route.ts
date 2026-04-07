import { type NextRequest, NextResponse } from "next/server";
import {
  getAvailableMoviePlatforms,
  getAvailableTvPlatforms,
} from "@/lib/tmdb-providers";
import type { ApiErrorResponse, AvailablePlatformsData } from "@/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<AvailablePlatformsData | ApiErrorResponse>> {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country") || "US";
  const type = searchParams.get("type") || "movie";

  try {
    const url =
      type === "tv"
        ? getAvailableTvPlatforms(country)
        : getAvailableMoviePlatforms(country);
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json({ platforms: data.results || [] });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
