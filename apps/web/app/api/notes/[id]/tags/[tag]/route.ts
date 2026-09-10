import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { parseParams } from "@/lib/api/params";
import { notFound, unauthorized } from "@/lib/api/response";
import { requireUserId } from "@/lib/api/session";

const paramsSchema = z.object({ id: z.uuid(), tag: z.string().min(1).max(100) });

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext<"/api/notes/[id]/tags/[tag]">,
) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsedParams = parseParams(paramsSchema, await params);
  if (parsedParams.error) return parsedParams.error;
  const { id: noteId, tag } = parsedParams.data;
  const normalizedTag = tag.toLowerCase();

  const note = await db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ id: notes.id, tags: notes.tags })
      .from(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)));
    if (!existing) return undefined;

    const [updated] = await tx
      .update(notes)
      .set({
        tags: existing.tags.filter((t) => t !== normalizedTag),
        updatedAt: new Date(),
      })
      .where(eq(notes.id, noteId))
      .returning();

    return updated;
  });

  if (!note) return notFound("Note");

  return new NextResponse(null, { status: 204 });
}
