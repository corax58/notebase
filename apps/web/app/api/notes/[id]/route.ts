import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { parseParams } from "@/lib/api/params";
import { folderBelongsToUser } from "@/lib/api/ownership";
import { errorResponse, notFound, unauthorized, validationError } from "@/lib/api/response";
import { requireUserId } from "@/lib/api/session";
import { normalizeTagNames, upsertTags } from "@/lib/api/tags";
import { updateNoteSchema } from "@/lib/validation/notes";

const paramsSchema = z.object({ id: z.uuid() });

export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/api/notes/[id]">,
) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsedParams = parseParams(paramsSchema, await params);
  if (parsedParams.error) return parsedParams.error;
  const { id } = parsedParams.data;

  const note = await db.query.notes.findFirst({
    where: and(eq(notes.id, id), eq(notes.userId, userId)),
    with: { folder: true },
  });

  if (!note) return notFound("Note");

  return NextResponse.json({ note });
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext<"/api/notes/[id]">,
) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsedParams = parseParams(paramsSchema, await params);
  if (parsedParams.error) return parsedParams.error;
  const { id } = parsedParams.data;

  const parsed = updateNoteSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const { tags: tagNames, ...values } = parsed.data;

  if (values.folderId && !(await folderBelongsToUser(values.folderId, userId))) {
    return errorResponse("Folder not found", 400);
  }

  const normalizedTags = tagNames && normalizeTagNames(tagNames);

  const note = await db.transaction(async (tx) => {
    const [updated] = await tx
      .update(notes)
      .set({
        ...values,
        ...(normalizedTags && { tags: normalizedTags }),
        updatedAt: new Date(),
      })
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning();

    if (!updated) return undefined;

    if (normalizedTags) {
      await upsertTags(tx, userId, normalizedTags);
    }

    return updated;
  });

  if (!note) return notFound("Note");

  return NextResponse.json({ note });
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext<"/api/notes/[id]">,
) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsedParams = parseParams(paramsSchema, await params);
  if (parsedParams.error) return parsedParams.error;
  const { id } = parsedParams.data;

  const [note] = await db
    .delete(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, userId)))
    .returning();

  if (!note) return notFound("Note");

  return new NextResponse(null, { status: 204 });
}
