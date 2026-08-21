import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { tags } from "@/db/schema";
import { isUniqueViolation } from "@/lib/api/db-errors";
import { parseParams } from "@/lib/api/params";
import { errorResponse, notFound, unauthorized, validationError } from "@/lib/api/response";
import { requireUserId } from "@/lib/api/session";
import { updateTagSchema } from "@/lib/validation/notes";

const paramsSchema = z.object({ id: z.uuid() });

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext<"/api/tags/[id]">,
) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsedParams = parseParams(paramsSchema, await params);
  if (parsedParams.error) return parsedParams.error;
  const { id } = parsedParams.data;

  const parsed = updateTagSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  try {
    const [tag] = await db
      .update(tags)
      .set(parsed.data)
      .where(and(eq(tags.id, id), eq(tags.userId, userId)))
      .returning();

    if (!tag) return notFound("Tag");

    return NextResponse.json({ tag });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return errorResponse("A tag with this name already exists", 409);
    }
    throw error;
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext<"/api/tags/[id]">,
) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsedParams = parseParams(paramsSchema, await params);
  if (parsedParams.error) return parsedParams.error;
  const { id } = parsedParams.data;

  const [tag] = await db
    .delete(tags)
    .where(and(eq(tags.id, id), eq(tags.userId, userId)))
    .returning();

  if (!tag) return notFound("Tag");

  return new NextResponse(null, { status: 204 });
}
