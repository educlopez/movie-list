import { type NextRequest, NextResponse } from "next/server";
import { getTrending } from "@/lib/tmdb";
import type { ApiErrorResponse, TrendingResponse } from "@/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<TrendingResponse | ApiErrorResponse>> {
  const { searchParams } = new URL(request.url);
  const time = searchParams.get("time") || "day";
  const type = searchParams.get("type") || "all";

  try {
    const response = await fetch(getTrending(type, time));
    const data = await response.json();
    return NextResponse.json({ results: data.results || [] });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
