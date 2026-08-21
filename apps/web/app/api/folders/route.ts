import { asc, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { folders } from "@/db/schema";
import { requireUserId } from "@/lib/api/session";
import { unauthorized, validationError } from "@/lib/api/response";
import { createFolderSchema } from "@/lib/validation/notes";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const rows = await db
    .select()
    .from(folders)
    .where(eq(folders.userId, userId))
    .orderBy(asc(folders.name));

  return NextResponse.json({ folders: rows });
}

export async function POST(request: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = createFolderSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const [folder] = await db
    .insert(folders)
    .values({ ...parsed.data, userId })
    .returning();

  return NextResponse.json({ folder }, { status: 201 });
}
