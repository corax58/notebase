import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { bundles } from "@/db/schema";
import { parseParams } from "@/lib/api/params";
import { requireUserId } from "@/lib/api/session";
import { notFound, unauthorized, validationError } from "@/lib/api/response";
import { getBundleWithNotes } from "@/lib/queries/bundles";
import { updateBundleSchema } from "@/lib/validation/notes";
import { z } from "zod";

const paramsSchema = z.object({ id: z.uuid() });

export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/api/bundles/[id]">,
) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsedParams = parseParams(paramsSchema, await params);
  if (parsedParams.error) return parsedParams.error;
  const { id } = parsedParams.data;

  const bundle = await getBundleWithNotes(userId, id);

  if (!bundle) return notFound("Bundle");

  return NextResponse.json({ bundle });
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext<"/api/bundles/[id]">,
) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsedParams = parseParams(paramsSchema, await params);
  if (parsedParams.error) return parsedParams.error;
  const { id } = parsedParams.data;

  const requestBody = await request.json();
  const parsed = updateBundleSchema.safeParse(requestBody);

  if (!parsed.success) return validationError(parsed.error);

  const [bundle] = await db
    .update(bundles)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(and(eq(bundles.id, id), eq(bundles.userId, userId)))
    .returning();

  if (!bundle) return notFound("Bundle");

  return NextResponse.json({ bundle });
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext<"/api/bundles/[id]">,
) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsedParams = parseParams(paramsSchema, await params);
  if (parsedParams.error) return parsedParams.error;
  const { id } = parsedParams.data;

  const [bundle] = await db
    .delete(bundles)
    .where(and(eq(bundles.id, id), eq(bundles.userId, userId)))
    .returning();

  if (!bundle) return notFound("Bundle");

  return new NextResponse(null, { status: 204 });
}
