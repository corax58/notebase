import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { tags } from "@/db/schema";
import { unauthorized } from "@/lib/api/response";
import { requireUserId } from "@/lib/api/session";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const rows = await db
    .select()
    .from(tags)
    .where(eq(tags.userId, userId))
    .orderBy(asc(tags.name));

  return NextResponse.json({ tags: rows });
}
