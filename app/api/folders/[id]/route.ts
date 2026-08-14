import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { folders } from "@/db/schema";
import { parseParams } from "@/lib/api/params";
import { requireUserId } from "@/lib/api/session";
import { notFound, unauthorized, validationError } from "@/lib/api/response";
import { updateFolderSchema } from "@/lib/validation/notes";
import { z } from "zod";

const paramsSchema = z.object({ id: z.uuid() });

export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/api/folders/[id]">,
) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsedParams = parseParams(paramsSchema, await params);
  if (parsedParams.error) return parsedParams.error;
  const { id } = parsedParams.data;

  const [folder] = await db
    .select()
    .from(folders)
    .where(and(eq(folders.id, id), eq(folders.userId, userId)));

  if (!folder) return notFound("Folder");

  return NextResponse.json({ folder });
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext<"/api/folders/[id]">,
) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsedParams = parseParams(paramsSchema, await params);
  if (parsedParams.error) return parsedParams.error;
  const { id } = parsedParams.data;

  const parsed = updateFolderSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const [folder] = await db
    .update(folders)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(and(eq(folders.id, id), eq(folders.userId, userId)))
    .returning();

  if (!folder) return notFound("Folder");

  return NextResponse.json({ folder });
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext<"/api/folders/[id]">,
) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsedParams = parseParams(paramsSchema, await params);
  if (parsedParams.error) return parsedParams.error;
  const { id } = parsedParams.data;

  const [folder] = await db
    .delete(folders)
    .where(and(eq(folders.id, id), eq(folders.userId, userId)))
    .returning();

  if (!folder) return notFound("Folder");

  return new NextResponse(null, { status: 204 });
}
