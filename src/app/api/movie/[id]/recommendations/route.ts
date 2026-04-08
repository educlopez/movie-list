import { type NextRequest, NextResponse } from "next/server";
import { getMovieRecommendations } from "@/lib/tmdb";
import type { ApiErrorResponse, TMDBMediaItem } from "@/types/tmdb";

interface TMDBRecommendationsResponse {
  results: TMDBMediaItem[];
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<TMDBMediaItem[] | ApiErrorResponse>> {
  const { id } = await params;

  try {
    const response = await fetch(getMovieRecommendations(id));
    const data: TMDBRecommendationsResponse = await response.json();

    return NextResponse.json(data.results, {
      headers: { "Cache-Control": "public, s-maxage=3600" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
