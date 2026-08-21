import { and, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { noteTags, notes } from "@/db/schema";
import { folderBelongsToUser, tagIdsBelongToUser } from "@/lib/api/ownership";
import { errorResponse, unauthorized, validationError } from "@/lib/api/response";
import { requireUserId } from "@/lib/api/session";
import { createNoteSchema, listNotesQuerySchema } from "@/lib/validation/notes";

export async function GET(request: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = listNotesQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  if (!parsed.success) return validationError(parsed.error);

  const { folderId, archived, label, tagId, q, limit, offset } = parsed.data;

  const conditions = [eq(notes.userId, userId)];
  if (folderId) conditions.push(eq(notes.folderId, folderId));
  if (archived !== undefined) conditions.push(eq(notes.archived, archived));
  if (label) conditions.push(eq(notes.label, label));
  if (q) {
    conditions.push(
      or(
        ilike(notes.content, `%${q}%`),
        ilike(notes.sourceTitle, `%${q}%`),
      )!,
    );
  }
  if (tagId) {
    conditions.push(
      inArray(
        notes.id,
        db
          .select({ id: noteTags.noteId })
          .from(noteTags)
          .where(eq(noteTags.tagId, tagId)),
      ),
    );
  }

  const rows = await db.query.notes.findMany({
    where: and(...conditions),
    orderBy: desc(notes.createdAt),
    limit,
    offset,
    with: {
      folder: true,
      noteTags: { with: { tag: true } },
    },
  });

  const results = rows.map(({ noteTags: linkedTags, ...note }) => ({
    ...note,
    tags: linkedTags.map((link) => link.tag),
  }));

  return NextResponse.json({ notes: results });
}

export async function POST(request: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = createNoteSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const { tagIds = [], ...values } = parsed.data;

  if (values.folderId && !(await folderBelongsToUser(values.folderId, userId))) {
    return errorResponse("Folder not found", 400);
  }
  if (!(await tagIdsBelongToUser(tagIds, userId))) {
    return errorResponse("One or more tags not found", 400);
  }

  const note = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(notes)
      .values({ ...values, userId })
      .returning();

    if (tagIds.length) {
      await tx
        .insert(noteTags)
        .values(tagIds.map((tagId) => ({ noteId: created.id, tagId })));
    }

    return created;
  });

  return NextResponse.json({ note }, { status: 201 });
}
