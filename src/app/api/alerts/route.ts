import { type NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { alert } from "@/db/schema";
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
    .from(alert)
    .where(eq(alert.userId, session.user.id))
    .orderBy(desc(alert.createdAt));

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
    .from(alert)
    .where(
      and(
        eq(alert.userId, session.user.id),
        eq(alert.tmdbId, tmdbId),
        eq(alert.mediaType, mediaType)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({ message: "Ya existe" }, { status: 200 });
  }

  const inserted = await db.insert(alert).values({
    userId: session.user.id,
    tmdbId,
    mediaType,
    title,
    posterPath,
    createdAt: new Date(),
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
    .delete(alert)
    .where(
      and(
        eq(alert.userId, session.user.id),
        eq(alert.tmdbId, tmdbId),
        eq(alert.mediaType, mediaType)
      )
    );

  return NextResponse.json({ ok: true });
}
