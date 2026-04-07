import { type NextRequest, NextResponse } from "next/server";
import { getTrending } from "@/lib/tmdb";
import type { ApiErrorResponse, TMDBPaginatedResponse } from "@/types/tmdb";

export async function GET(
  request: NextRequest
): Promise<NextResponse<TMDBPaginatedResponse | ApiErrorResponse>> {
  const { searchParams } = new URL(request.url);
  const time = searchParams.get("time") || "day";
  const type = searchParams.get("type") || "all";

  try {
    const response = await fetch(getTrending(type, time));
    const data = await response.json();
    return NextResponse.json({
      results: data.results || [],
      total_pages: data.total_pages || 1,
      total_results: data.total_results || (data.results?.length ?? 0),
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
