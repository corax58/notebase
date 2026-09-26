import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { bundleItems, bundles } from "@/db/schema";
import { notesBelongToUser } from "@/lib/api/ownership";
import {
  errorResponse,
  unauthorized,
  validationError,
} from "@/lib/api/response";
import { requireUserId } from "@/lib/api/session";
import { getBundles } from "@/lib/queries/bundles";
import { createBundleSchema } from "@/lib/validation/notes";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const rows = await getBundles(userId);

  return NextResponse.json({ bundles: rows });
}

export async function POST(request: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = createBundleSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const { name, noteIds } = parsed.data;

  if (!(await notesBelongToUser(noteIds, userId))) {
    return errorResponse("One or more notes not found", 400);
  }

  const bundle = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(bundles)
      .values({ name, userId, noteOrder: noteIds })
      .returning();

    if (noteIds.length) {
      await tx
        .insert(bundleItems)
        .values(noteIds.map((noteId) => ({ bundleId: created.id, noteId })));
    }

    return created;
  });

  return NextResponse.json({ bundle }, { status: 201 });
}
