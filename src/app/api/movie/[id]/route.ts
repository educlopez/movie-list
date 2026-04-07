import { type NextRequest, NextResponse } from "next/server";
import { getMovieCasts, getMovieDetail } from "@/lib/tmdb";
import type { ApiErrorResponse, MovieDetailResponse } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<MovieDetailResponse | ApiErrorResponse>> {
  const { id } = await params;

  try {
    const [response, response2] = await Promise.all([
      fetch(getMovieDetail(id)),
      fetch(getMovieCasts(id)),
    ]);
    const [data, data2] = await Promise.all([
      response.json(),
      response2.json(),
    ]);
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
