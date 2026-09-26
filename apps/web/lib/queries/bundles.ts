import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { bundleItems, bundles } from "@/db/schema";

export function getBundles(userId: string) {
  return db
    .select({
      id: bundles.id,
      name: bundles.name,
      compiledAt: bundles.compiledAt,
      createdAt: bundles.createdAt,
      updatedAt: bundles.updatedAt,
      noteCount: count(bundleItems.id),
    })
    .from(bundles)
    .leftJoin(bundleItems, eq(bundleItems.bundleId, bundles.id))
    .where(eq(bundles.userId, userId))
    .groupBy(bundles.id)
    .orderBy(desc(bundles.updatedAt));
}

export type BundleRow = Awaited<ReturnType<typeof getBundles>>[number];

// noteOrder is the source of truth for sequence, bundleItems for membership.
// Removals are kept in sync by the bundle_items_after_delete trigger, so this
// is only a safety net: drop ids with no matching item (and duplicates), then
// append any members missing from the order, in the order given.
export function reconcileNoteOrder(noteOrder: string[], memberIds: string[]) {
  const remaining = new Set(memberIds);
  const ordered = noteOrder.filter((id) => remaining.delete(id));
  return [...ordered, ...remaining];
}

export async function getBundleWithNotes(userId: string, bundleId: string) {
  const bundle = await db.query.bundles.findFirst({
    where: and(eq(bundles.id, bundleId), eq(bundles.userId, userId)),
    with: {
      items: {
        orderBy: bundleItems.createdAt,
        with: { note: { with: { folder: true } } },
      },
    },
  });

  if (!bundle) return null;

  const { items, ...rest } = bundle;
  const notesById = new Map(items.map((item) => [item.noteId, item.note]));
  const noteOrder = reconcileNoteOrder(bundle.noteOrder, [...notesById.keys()]);

  return {
    ...rest,
    noteOrder,
    notes: noteOrder.map((id) => notesById.get(id)!),
  };
}

export type BundleWithNotes = NonNullable<
  Awaited<ReturnType<typeof getBundleWithNotes>>
>;
