import { type NextRequest, NextResponse } from "next/server";
import { getMovieCasts, getMovieDetail } from "@/lib/tmdb";
import type { ApiErrorResponse, MovieDetailResponse } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<MovieDetailResponse | ApiErrorResponse>> {
  const { id } = await params;

  try {
    const response = await fetch(getMovieDetail(id));
    const response2 = await fetch(getMovieCasts(id));
    const data = await response.json();
    const data2 = await response2.json();
    return NextResponse.json({
      detail: data,
      credits: data2,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
