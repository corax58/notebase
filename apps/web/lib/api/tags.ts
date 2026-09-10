import type { db as Database } from "@/db";
import { tags } from "@/db/schema";

export function normalizeTagNames(names: string[]) {
  return [...new Set(names.map((name) => name.trim().toLowerCase()).filter(Boolean))];
}

export async function upsertTags(
  tx: Pick<typeof Database, "insert">,
  userId: string,
  names: string[],
) {
  if (!names.length) return;
  await tx
    .insert(tags)
    .values(names.map((name) => ({ userId, name })))
    .onConflictDoNothing();
}
