import { type NextRequest, NextResponse } from "next/server";
import { getUrl2, movieTopRated } from "@/lib/tmdb";
import type { ApiErrorResponse, TMDBPaginatedResponse } from "@/types/tmdb";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<TMDBPaginatedResponse | ApiErrorResponse>> {
  const { id } = await params;

  try {
    const url = getUrl2(movieTopRated, id);
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json({
      results: data.results,
      total_pages: data.total_pages,
      total_results: data.total_results,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
