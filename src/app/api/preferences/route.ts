import { type NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userPreference } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const prefs = await db
    .select()
    .from(userPreference)
    .where(eq(userPreference.userId, session.user.id))
    .limit(1);

  if (prefs.length === 0) {
    return NextResponse.json({ country: "", platforms: [] });
  }

  return NextResponse.json({
    country: prefs[0].country,
    platforms: JSON.parse(prefs[0].platforms),
  });
}

export async function PUT(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { country, platforms } = body;

  const existing = await db
    .select()
    .from(userPreference)
    .where(eq(userPreference.userId, session.user.id))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(userPreference).values({
      userId: session.user.id,
      country,
      platforms: JSON.stringify(platforms),
    });
  } else {
    await db
      .update(userPreference)
      .set({ country, platforms: JSON.stringify(platforms) })
      .where(eq(userPreference.userId, session.user.id));
  }

  return NextResponse.json({ ok: true });
}
