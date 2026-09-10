import { and, arrayContains, desc, eq, ilike, or } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { folderBelongsToUser } from "@/lib/api/ownership";
import {
  errorResponse,
  unauthorized,
  validationError,
} from "@/lib/api/response";
import { requireUserId } from "@/lib/api/session";
import { normalizeTagNames, upsertTags } from "@/lib/api/tags";
import { createNoteSchema, listNotesQuerySchema } from "@/lib/validation/notes";

export async function GET(request: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = listNotesQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  if (!parsed.success) return validationError(parsed.error);

  const { folderId, archived, label, tag, q, limit, offset } = parsed.data;

  const conditions = [eq(notes.userId, userId)];
  if (folderId) conditions.push(eq(notes.folderId, folderId));
  if (archived !== undefined) conditions.push(eq(notes.archived, archived));
  if (label) conditions.push(eq(notes.label, label));
  if (q) {
    conditions.push(
      or(ilike(notes.content, `%${q}%`), ilike(notes.sourceTitle, `%${q}%`))!,
    );
  }
  if (tag) {
    conditions.push(arrayContains(notes.tags, [tag]));
  }

  const rows = await db.query.notes.findMany({
    where: and(...conditions),
    orderBy: desc(notes.createdAt),
    limit,
    offset,
    with: { folder: true },
  });

  return NextResponse.json({ notes: rows });
}

export async function POST(request: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = createNoteSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const { tags: tagNames = [], ...values } = parsed.data;

  if (
    values.folderId &&
    !(await folderBelongsToUser(values.folderId, userId))
  ) {
    return errorResponse("Folder not found", 400);
  }

  const normalizedTags = normalizeTagNames(tagNames);

  const note = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(notes)
      .values({ ...values, userId, tags: normalizedTags })
      .returning();

    await upsertTags(tx, userId, normalizedTags);

    return created;
  });

  return NextResponse.json({ note }, { status: 201 });
}
