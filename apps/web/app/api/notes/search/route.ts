import { NextResponse, type NextRequest } from "next/server";
import { unauthorized, validationError } from "@/lib/api/response";
import { requireUserId } from "@/lib/api/session";
import { parseNoteFilters } from "@/lib/note-filters";
import { searchNotes } from "@/lib/queries/notes";
import { searchNotesRangeSchema } from "@/lib/validation/notes";

// Takes the notes page's own query string plus a range, so the page can ask
// for what comes after the notes it was rendered with
export async function GET(request: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();

  const params = request.nextUrl.searchParams;
  const range = searchNotesRangeSchema.safeParse(Object.fromEntries(params));
  if (!range.success) return validationError(range.error);

  const filters = parseNoteFilters({
    ...Object.fromEntries(params),
    folder: params.getAll("folder"),
    tag: params.getAll("tag"),
  });

  return NextResponse.json(await searchNotes(userId, filters, range.data));
}
