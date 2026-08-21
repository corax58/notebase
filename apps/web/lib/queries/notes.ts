import { and, asc, desc, eq } from "drizzle-orm"
import { db } from "@/db"
import { folders, notes, tags } from "@/db/schema"

export async function getNotes(userId: string, folderId?: string) {
  const rows = await db.query.notes.findMany({
    where: folderId
      ? and(eq(notes.userId, userId), eq(notes.folderId, folderId))
      : eq(notes.userId, userId),
    orderBy: desc(notes.createdAt),
    limit: 50,
    with: {
      folder: true,
      noteTags: { with: { tag: true } },
    },
  })

  return rows.map(({ noteTags: linkedTags, ...note }) => ({
    ...note,
    tags: linkedTags.map((link) => link.tag),
  }))
}

export type NoteWithRelations = Awaited<ReturnType<typeof getNotes>>[number]

export function getFolders(userId: string) {
  return db
    .select()
    .from(folders)
    .where(eq(folders.userId, userId))
    .orderBy(asc(folders.name))
}

export function getTags(userId: string) {
  return db.select().from(tags).where(eq(tags.userId, userId)).orderBy(asc(tags.name))
}
