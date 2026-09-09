import { z } from "zod";

// Mirrors createNoteSchema in apps/web/lib/validation/notes.ts so notes are
// rejected client-side with the same rules the API enforces.
export const createNoteSchema = z.object({
  content: z.string().trim().min(1, "Write something before saving your note."),
  folderId: z.uuid().nullable().optional(),
  sourceUrl: z.url("That source URL doesn't look right.").nullable().optional(),
  sourceTitle: z.string().trim().max(500).nullable().optional(),
  faviconUrl: z.url().nullable().optional(),
  label: z
    .string()
    .trim()
    .max(100, "Keep the label under 100 characters.")
    .nullable()
    .optional(),
  tagIds: z.array(z.uuid()).optional(),
});
