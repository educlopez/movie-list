import { type NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { watchlistItem } from "@/db/schema";
import { auth } from "@/lib/auth";

async function getSession(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session;
}

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const items = await db
    .select()
    .from(watchlistItem)
    .where(eq(watchlistItem.userId, session.user.id))
    .orderBy(watchlistItem.addedAt);

  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { tmdbId, mediaType, title, posterPath } = body;

  // Check if already exists
  const existing = await db
    .select()
    .from(watchlistItem)
    .where(
      and(
        eq(watchlistItem.userId, session.user.id),
        eq(watchlistItem.tmdbId, tmdbId),
        eq(watchlistItem.mediaType, mediaType)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({ message: "Ya existe" }, { status: 200 });
  }

  const inserted = await db.insert(watchlistItem).values({
    userId: session.user.id,
    tmdbId,
    mediaType,
    title,
    posterPath,
    addedAt: new Date(),
  });

  return NextResponse.json(inserted, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { tmdbId, mediaType } = body;

  await db
    .delete(watchlistItem)
    .where(
      and(
        eq(watchlistItem.userId, session.user.id),
        eq(watchlistItem.tmdbId, tmdbId),
        eq(watchlistItem.mediaType, mediaType)
      )
    );

  return NextResponse.json({ ok: true });
}
