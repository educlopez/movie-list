import { type NextRequest, NextResponse } from "next/server";
import { getTvWatchProviders } from "@/lib/tmdb-providers";
import type {
  AlternativeCountry,
  TMDBWatchProvidersResponse,
  WatchProvidersData,
} from "@/types/providers";
import type { ApiErrorResponse } from "@/types/tmdb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<WatchProvidersData | ApiErrorResponse>> {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country") || "US";

  try {
    const response = await fetch(getTvWatchProviders(id));
    const data: TMDBWatchProvidersResponse = await response.json();
    const countryData = data.results[country];
    const alternatives: AlternativeCountry[] = [];

    if (!countryData?.flatrate) {
      for (const [code, providers] of Object.entries(data.results)) {
        if (code !== country && providers.flatrate?.length) {
          alternatives.push({ country: code, providers: providers.flatrate });
        }
      }
      alternatives.sort((a, b) => b.providers.length - a.providers.length);
    }

    return NextResponse.json({
      country,
      flatrate: countryData?.flatrate || [],
      rent: countryData?.rent || [],
      buy: countryData?.buy || [],
      link: countryData?.link || "",
      alternatives: alternatives.slice(0, 10),
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
