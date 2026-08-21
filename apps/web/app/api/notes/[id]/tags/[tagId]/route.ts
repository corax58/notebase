import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { noteTags, notes } from "@/db/schema";
import { parseParams } from "@/lib/api/params";
import { notFound, unauthorized } from "@/lib/api/response";
import { requireUserId } from "@/lib/api/session";

const paramsSchema = z.object({ id: z.uuid(), tagId: z.uuid() });

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext<"/api/notes/[id]/tags/[tagId]">,
) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsedParams = parseParams(paramsSchema, await params);
  if (parsedParams.error) return parsedParams.error;
  const { id: noteId, tagId } = parsedParams.data;

  const [note] = await db
    .select({ id: notes.id })
    .from(notes)
    .where(and(eq(notes.id, noteId), eq(notes.userId, userId)));
  if (!note) return notFound("Note");

  await db
    .delete(noteTags)
    .where(and(eq(noteTags.noteId, noteId), eq(noteTags.tagId, tagId)));

  return new NextResponse(null, { status: 204 });
}
