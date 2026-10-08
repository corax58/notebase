import {
  and,
  arrayContains,
  arrayOverlaps,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import { db } from "@/db";
import { folders, notes, tags } from "@/db/schema";
import {
  NO_FOLDER,
  NOTE_CREATED_OPTIONS,
  NOTES_PAGE_SIZE,
  parseSearchTerms,
  type NoteFilters,
  type NoteSort,
} from "@/lib/note-filters";

export async function getNotes(userId: string, folderId?: string) {
  return db.query.notes.findMany({
    where: folderId
      ? and(eq(notes.userId, userId), eq(notes.folderId, folderId))
      : eq(notes.userId, userId),
    orderBy: desc(notes.createdAt),
    limit: 50,
    with: { folder: true },
  });
}

export type NoteWithRelations = Awaited<ReturnType<typeof getNotes>>[number];

const DAY_MS = 24 * 60 * 60 * 1000;

// Each ends on a unique column so the order holds from one request to the next
const NOTE_SORT_ORDER: Record<NoteSort, SQL[]> = {
  newest: [desc(notes.createdAt), desc(notes.id)],
  oldest: [asc(notes.createdAt), asc(notes.id)],
  updated: [desc(notes.updatedAt), desc(notes.id)],
  title: [
    sql`lower(${notes.label}) asc nulls last`,
    desc(notes.createdAt),
    desc(notes.id),
  ],
};

// % and _ are wildcards to LIKE — match them literally when the user types them
function containsPattern(term: string) {
  return `%${term.replace(/[\\%_]/g, "\\$&")}%`;
}

function tagMatches(pattern: string) {
  return sql`exists (select 1 from unnest(${notes.tags}) as note_tag(name) where note_tag.name ilike ${pattern})`;
}

// Expects folders to be joined in: free-text search looks at the folder name too
export function noteFilterConditions(userId: string, filters: NoteFilters) {
  const conditions: (SQL | undefined)[] = [eq(notes.userId, userId)];
  const terms = parseSearchTerms(filters.q);

  // Every word has to turn up somewhere on the note, but not all in one field
  for (const term of terms.text) {
    const pattern = containsPattern(term);
    conditions.push(
      or(
        ilike(notes.label, pattern),
        ilike(notes.content, pattern),
        ilike(notes.sourceTitle, pattern),
        ilike(notes.sourceUrl, pattern),
        ilike(folders.name, pattern),
        tagMatches(pattern),
      ),
    );
  }
  for (const term of terms.tags) {
    conditions.push(tagMatches(containsPattern(term)));
  }

  if (filters.folders.length > 0) {
    const ids = filters.folders.filter((id) => id !== NO_FOLDER);
    conditions.push(
      or(
        ids.length > 0 ? inArray(notes.folderId, ids) : undefined,
        filters.folders.includes(NO_FOLDER)
          ? isNull(notes.folderId)
          : undefined,
      ),
    );
  }

  if (filters.tags.length > 0) {
    conditions.push(
      filters.tagMatch === "all"
        ? arrayContains(notes.tags, filters.tags)
        : arrayOverlaps(notes.tags, filters.tags),
    );
  }

  const days = NOTE_CREATED_OPTIONS.find(
    (option) => option.value === filters.created,
  )?.days;
  if (days) {
    conditions.push(gte(notes.createdAt, new Date(Date.now() - days * DAY_MS)));
  }

  if (filters.source === "web") conditions.push(isNotNull(notes.sourceUrl));
  if (filters.source === "manual") conditions.push(isNull(notes.sourceUrl));

  if (filters.status !== "all") {
    conditions.push(eq(notes.archived, filters.status === "archived"));
  }

  return and(...conditions);
}

export async function searchNotes(
  userId: string,
  filters: NoteFilters,
  { offset = 0, limit = NOTES_PAGE_SIZE } = {},
) {
  const where = noteFilterConditions(userId, filters);

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({ note: notes, folder: folders })
      .from(notes)
      .leftJoin(folders, eq(notes.folderId, folders.id))
      .where(where)
      .orderBy(...NOTE_SORT_ORDER[filters.sort])
      .limit(limit)
      .offset(offset),
    db
      .select({ total: count() })
      .from(notes)
      .leftJoin(folders, eq(notes.folderId, folders.id))
      .where(where),
  ]);

  return {
    notes: rows.map(({ note, folder }): NoteWithRelations => ({
      ...note,
      folder,
    })),
    total,
  };
}

// Note counts behind the filter menus. They cover all of the user's notes, not
// the current result set, so the numbers stay put while filters are toggled.
export async function getNoteFacets(userId: string) {
  const [folderRows, tagRows] = await Promise.all([
    db
      .select({
        folderId: notes.folderId,
        count: count(),
        archived:
          sql<number>`count(*) filter (where ${notes.archived})`.mapWith(
            Number,
          ),
      })
      .from(notes)
      .where(eq(notes.userId, userId))
      .groupBy(notes.folderId),
    // Read from the notes themselves — the tags table is an autocomplete
    // source and can still list tags that no note uses any more
    db
      .select({ name: sql<string>`note_tag.name`, count: count() })
      .from(notes)
      .innerJoin(sql`unnest(${notes.tags}) as note_tag(name)`, sql`true`)
      .where(eq(notes.userId, userId))
      .groupBy(sql`note_tag.name`)
      .orderBy(desc(count()), sql`note_tag.name`),
  ]);

  const folderCounts: Record<string, number> = {};
  let total = 0;
  let archived = 0;
  for (const row of folderRows) {
    folderCounts[row.folderId ?? NO_FOLDER] = row.count;
    total += row.count;
    archived += row.archived;
  }

  return { total, archived, folders: folderCounts, tags: tagRows };
}

export type NoteFacets = Awaited<ReturnType<typeof getNoteFacets>>;

export function getFolders(userId: string) {
  return db
    .select()
    .from(folders)
    .where(eq(folders.userId, userId))
    .orderBy(asc(folders.name));
}

export function getTags(userId: string) {
  return db
    .select()
    .from(tags)
    .where(eq(tags.userId, userId))
    .orderBy(asc(tags.name));
}
export type Folder = typeof folders.$inferSelect;
export type Tag = typeof tags.$inferSelect;
