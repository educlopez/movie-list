import { type NextRequest, NextResponse } from "next/server";
import { getTvVideos } from "@/lib/tmdb";
import type { ApiErrorResponse } from "@/types/tmdb";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;

  try {
    const response = await fetch(getTvVideos(id));
    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=86400",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}
