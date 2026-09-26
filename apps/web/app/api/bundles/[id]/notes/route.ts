import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { bundleItems, bundles } from "@/db/schema";
import { notesBelongToUser } from "@/lib/api/ownership";
import { parseParams } from "@/lib/api/params";
import {
  errorResponse,
  notFound,
  unauthorized,
  validationError,
} from "@/lib/api/response";
import { requireUserId } from "@/lib/api/session";
import { reconcileNoteOrder } from "@/lib/queries/bundles";
import {
  addBundleNotesSchema,
  MAX_BUNDLE_NOTES,
} from "@/lib/validation/notes";

const paramsSchema = z.object({ id: z.uuid() });

// Notes already in the bundle are skipped, not moved. New notes are inserted
// together at `position` in the current order, keeping the order they were sent in.
export async function POST(
  request: NextRequest,
  { params }: RouteContext<"/api/bundles/[id]/notes">,
) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsedParams = parseParams(paramsSchema, await params);
  if (parsedParams.error) return parsedParams.error;
  const { id: bundleId } = parsedParams.data;

  const parsed = addBundleNotesSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  const { noteIds, position } = parsed.data;

  if (!(await notesBelongToUser(noteIds, userId))) {
    return errorResponse("One or more notes not found", 400);
  }

  const result = await db.transaction(async (tx) => {
    // Row lock serializes concurrent edits to this bundle's noteOrder
    const [bundle] = await tx
      .select({ noteOrder: bundles.noteOrder })
      .from(bundles)
      .where(and(eq(bundles.id, bundleId), eq(bundles.userId, userId)))
      .for("update");
    if (!bundle) return { error: notFound("Bundle") };

    const items = await tx
      .select({ noteId: bundleItems.noteId })
      .from(bundleItems)
      .where(eq(bundleItems.bundleId, bundleId))
      .orderBy(bundleItems.createdAt);

    const current = reconcileNoteOrder(
      bundle.noteOrder,
      items.map((item) => item.noteId),
    );
    const members = new Set(current);
    const added = noteIds.filter((noteId) => !members.has(noteId));

    if (current.length + added.length > MAX_BUNDLE_NOTES) {
      return {
        error: errorResponse(
          `A bundle can hold at most ${MAX_BUNDLE_NOTES} notes`,
          400,
        ),
      };
    }

    if (added.length) {
      await tx
        .insert(bundleItems)
        .values(added.map((noteId) => ({ bundleId, noteId })));
    }

    const at = Math.min(position ?? current.length, current.length);
    const [updated] = await tx
      .update(bundles)
      .set({
        noteOrder: [...current.slice(0, at), ...added, ...current.slice(at)],
        updatedAt: new Date(),
      })
      .where(eq(bundles.id, bundleId))
      .returning();

    return { bundle: updated, added };
  });

  if (result.error) return result.error;

  return NextResponse.json(
    { bundle: result.bundle, added: result.added },
    { status: 201 },
  );
}
