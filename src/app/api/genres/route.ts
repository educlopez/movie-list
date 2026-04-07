import { type NextRequest, NextResponse } from "next/server";
import { getGenreList } from "@/lib/tmdb";
import type { ApiErrorResponse, GenreListResponse } from "@/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<GenreListResponse | ApiErrorResponse>> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "movie";

  try {
    const response = await fetch(getGenreList(type));
    const data = await response.json();
    return NextResponse.json({ genres: data.genres || [] });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
