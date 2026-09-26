import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { bundleItems, bundles } from "@/db/schema";
import { parseParams } from "@/lib/api/params";
import {
  errorResponse,
  notFound,
  unauthorized,
  validationError,
} from "@/lib/api/response";
import { requireUserId } from "@/lib/api/session";
import { reorderBundleNotesSchema } from "@/lib/validation/notes";

const paramsSchema = z.object({ id: z.uuid() });

export async function PUT(
  request: NextRequest,
  { params }: RouteContext<"/api/bundles/[id]/order">,
) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsedParams = parseParams(paramsSchema, await params);
  if (parsedParams.error) return parsedParams.error;
  const { id: bundleId } = parsedParams.data;

  const parsed = reorderBundleNotesSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  const { noteIds } = parsed.data;

  const result = await db.transaction(async (tx) => {
    // Row lock serializes concurrent edits to this bundle's noteOrder
    const [bundle] = await tx
      .select({ id: bundles.id })
      .from(bundles)
      .where(and(eq(bundles.id, bundleId), eq(bundles.userId, userId)))
      .for("update");
    if (!bundle) return { error: notFound("Bundle") };

    const items = await tx
      .select({ noteId: bundleItems.noteId })
      .from(bundleItems)
      .where(eq(bundleItems.bundleId, bundleId));

    // noteIds is already unique (schema), so equal size + all present = same set
    const members = new Set(items.map((item) => item.noteId));
    if (
      noteIds.length !== members.size ||
      !noteIds.every((noteId) => members.has(noteId))
    ) {
      return {
        error: errorResponse(
          "The bundle's notes have changed — reload and try again",
          409,
        ),
      };
    }

    const [updated] = await tx
      .update(bundles)
      .set({ noteOrder: noteIds, updatedAt: new Date() })
      .where(eq(bundles.id, bundleId))
      .returning();

    return { bundle: updated };
  });

  if (result.error) return result.error;

  return NextResponse.json({ bundle: result.bundle });
}
