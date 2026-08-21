import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { noteTags, notes } from "@/db/schema";
import { parseParams } from "@/lib/api/params";
import { tagIdsBelongToUser } from "@/lib/api/ownership";
import { errorResponse, notFound, unauthorized, validationError } from "@/lib/api/response";
import { requireUserId } from "@/lib/api/session";

const paramsSchema = z.object({ id: z.uuid() });
const addTagSchema = z.object({ tagId: z.uuid() });

export async function POST(
  request: NextRequest,
  { params }: RouteContext<"/api/notes/[id]/tags">,
) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsedParams = parseParams(paramsSchema, await params);
  if (parsedParams.error) return parsedParams.error;
  const { id: noteId } = parsedParams.data;

  const parsed = addTagSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  const { tagId } = parsed.data;

  const [note] = await db
    .select({ id: notes.id })
    .from(notes)
    .where(and(eq(notes.id, noteId), eq(notes.userId, userId)));
  if (!note) return notFound("Note");

  if (!(await tagIdsBelongToUser([tagId], userId))) {
    return errorResponse("Tag not found", 400);
  }

  await db.insert(noteTags).values({ noteId, tagId }).onConflictDoNothing();

  return NextResponse.json({ noteId, tagId }, { status: 201 });
}
