import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { bundleItems, bundles } from "@/db/schema";
import { parseParams } from "@/lib/api/params";
import { notFound, unauthorized } from "@/lib/api/response";
import { requireUserId } from "@/lib/api/session";

const paramsSchema = z.object({ id: z.uuid(), noteId: z.uuid() });

// noteOrder is cleaned up by the bundle_items_after_delete trigger
// (drizzle/0004_bundle_note_order_trigger.sql), not here.
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext<"/api/bundles/[id]/notes/[noteId]">,
) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsedParams = parseParams(paramsSchema, await params);
  if (parsedParams.error) return parsedParams.error;
  const { id: bundleId, noteId } = parsedParams.data;

  const error = await db.transaction(async (tx) => {
    // Take the bundle lock first, same as POST, so the two can't deadlock
    const [bundle] = await tx
      .select({ id: bundles.id })
      .from(bundles)
      .where(and(eq(bundles.id, bundleId), eq(bundles.userId, userId)))
      .for("update");
    if (!bundle) return notFound("Bundle");

    const [removed] = await tx
      .delete(bundleItems)
      .where(
        and(eq(bundleItems.bundleId, bundleId), eq(bundleItems.noteId, noteId)),
      )
      .returning({ id: bundleItems.id });
    if (!removed) return notFound("Note in bundle");

    await tx
      .update(bundles)
      .set({ updatedAt: new Date() })
      .where(eq(bundles.id, bundleId));
  });

  if (error) return error;

  return new NextResponse(null, { status: 204 });
}
