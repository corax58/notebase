import { asc, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { tags } from "@/db/schema";
import { isUniqueViolation } from "@/lib/api/db-errors";
import { errorResponse, unauthorized, validationError } from "@/lib/api/response";
import { requireUserId } from "@/lib/api/session";
import { createTagSchema } from "@/lib/validation/notes";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const rows = await db
    .select()
    .from(tags)
    .where(eq(tags.userId, userId))
    .orderBy(asc(tags.name));

  return NextResponse.json({ tags: rows });
}

export async function POST(request: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const parsed = createTagSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  try {
    const [tag] = await db
      .insert(tags)
      .values({ ...parsed.data, userId })
      .returning();

    return NextResponse.json({ tag }, { status: 201 });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return errorResponse("A tag with this name already exists", 409);
    }
    throw error;
  }
}
