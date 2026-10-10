import { sql } from "drizzle-orm";
import type { db as Database } from "@/db";
import { tags } from "@/db/schema";

export function normalizeTagNames(names: string[]) {
  return [...new Set(names.map((name) => name.trim().toLowerCase()).filter(Boolean))];
}

// Adds the names that are new and marks all of them as just used, which moves
// them to the top of the tag suggestions
export async function upsertTags(
  tx: Pick<typeof Database, "insert">,
  userId: string,
  names: string[],
) {
  if (!names.length) return;
  await tx
    .insert(tags)
    .values(names.map((name) => ({ userId, name })))
    .onConflictDoUpdate({
      target: [tags.userId, tags.name],
      set: { lastUsedAt: sql`now()` },
    });
}
