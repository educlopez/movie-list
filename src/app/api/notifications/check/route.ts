import { type NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { alert, notification } from "@/db/schema";
import { auth } from "@/lib/auth";

async function getSession(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session;
}

interface CheckItem {
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string;
  providerName: string;
  providerIcon?: string;
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { items } = body as { items: CheckItem[] };

  if (!items || items.length === 0) {
    return NextResponse.json({ created: 0 });
  }

  // Get all user alerts
  const userAlerts = await db
    .select()
    .from(alert)
    .where(eq(alert.userId, session.user.id));

  if (userAlerts.length === 0) {
    return NextResponse.json({ created: 0 });
  }

  const alertMap = new Map(
    userAlerts.map((a) => [`${a.tmdbId}-${a.mediaType}`, a])
  );

  let created = 0;

  for (const item of items) {
    const key = `${item.tmdbId}-${item.mediaType}`;
    if (!alertMap.has(key)) continue;

    // Check if notification already exists for this tmdbId + provider combo
    const existing = await db
      .select()
      .from(notification)
      .where(
        and(
          eq(notification.userId, session.user.id),
          eq(notification.tmdbId, item.tmdbId),
          eq(notification.mediaType, item.mediaType),
          eq(notification.providerName, item.providerName)
        )
      )
      .limit(1);

    if (existing.length > 0) continue;

    await db.insert(notification).values({
      userId: session.user.id,
      tmdbId: item.tmdbId,
      mediaType: item.mediaType,
      title: item.title,
      posterPath: item.posterPath,
      providerName: item.providerName,
      providerIcon: item.providerIcon ?? null,
      type: "available",
      read: false,
      createdAt: new Date(),
    });

    created++;
  }

  return NextResponse.json({ created });
}
