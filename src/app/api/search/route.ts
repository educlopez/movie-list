import { type NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/tmdb";
import type { ApiErrorResponse, TMDBSearchResponse } from "@/types/tmdb";

export async function GET(
  request: NextRequest
): Promise<NextResponse<TMDBSearchResponse | ApiErrorResponse>> {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const page = searchParams.get("page") || "1";

  if (!query.trim()) {
    return NextResponse.json({
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    });
  }

  try {
    const response = await fetch(search(query, page));
    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
