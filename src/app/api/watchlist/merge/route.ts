import { type NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { watchlistItem } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const items: Array<{
    id: number;
    media_type: "movie" | "tv";
    title: string;
    poster_path: string;
    added_at: number;
  }> = await request.json();

  if (!Array.isArray(items)) {
    return NextResponse.json({ error: "Formato invalido" }, { status: 400 });
  }

  let merged = 0;
  for (const item of items) {
    const existing = await db
      .select()
      .from(watchlistItem)
      .where(
        and(
          eq(watchlistItem.userId, session.user.id),
          eq(watchlistItem.tmdbId, item.id),
          eq(watchlistItem.mediaType, item.media_type)
        )
      )
      .limit(1);

    if (existing.length === 0) {
      await db.insert(watchlistItem).values({
        userId: session.user.id,
        tmdbId: item.id,
        mediaType: item.media_type,
        title: item.title,
        posterPath: item.poster_path,
        addedAt: new Date(item.added_at),
      });
      merged++;
    }
  }

  return NextResponse.json({ merged });
}
