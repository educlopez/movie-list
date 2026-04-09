import { type NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notification } from "@/db/schema";
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
    .from(notification)
    .where(eq(notification.userId, session.user.id))
    .orderBy(desc(notification.createdAt))
    .limit(50);

  return NextResponse.json(items);
}

export async function PUT(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { ids } = body as { ids?: number[] };

  if (ids && ids.length > 0) {
    // Mark specific notifications as read
    for (const id of ids) {
      await db
        .update(notification)
        .set({ read: true })
        .where(
          eq(notification.id, id)
        );
    }
  } else {
    // Mark all as read
    await db
      .update(notification)
      .set({ read: true })
      .where(eq(notification.userId, session.user.id));
  }

  return NextResponse.json({ ok: true });
}
