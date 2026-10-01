import { and, eq, notInArray } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { bundleItems, bundles } from "@/db/schema";
import { parseParams } from "@/lib/api/params";
import { requireUserId } from "@/lib/api/session";
import {
  errorResponse,
  notFound,
  unauthorized,
  validationError,
} from "@/lib/api/response";
import { getBundleWithNotes } from "@/lib/queries/bundles";
import { updateBundleSchema } from "@/lib/validation/notes";
import { z } from "zod";
import { notesBelongToUser } from "@/lib/api/ownership";

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

  const { noteIds, ...fields } = parsed.data;
  const orderedIds = noteIds ? [...new Set(noteIds)] : undefined; // dedupe, keep order
  if (orderedIds?.length) {
    if (!(await notesBelongToUser(orderedIds, userId))) {
      return errorResponse("One or more notes not found", 400);
    }
  }

  const bundle = await db.transaction(async (tx) => {
    const [updated] = await tx
      .update(bundles)
      .set({
        ...fields,
        ...(orderedIds && { noteOrder: orderedIds }),
        updatedAt: new Date(),
      })
      .where(and(eq(bundles.id, id), eq(bundles.userId, userId)))
      .returning();

    if (!updated) return null;

    if (orderedIds) {
      // Remove memberships no longer selected (empty list removes all)
      await tx
        .delete(bundleItems)
        .where(
          and(
            eq(bundleItems.bundleId, id),
            orderedIds.length
              ? notInArray(bundleItems.noteId, orderedIds)
              : undefined,
          ),
        );

      // Add new ones; existing rows are skipped
      if (orderedIds.length) {
        await tx
          .insert(bundleItems)
          .values(orderedIds.map((noteId) => ({ bundleId: id, noteId })))
          .onConflictDoNothing({
            target: [bundleItems.bundleId, bundleItems.noteId],
          });
      }
    }

    return updated;
  });

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
