import { z } from "zod";

// Mirrors createNoteSchema in apps/web/lib/validation/notes.ts so notes are
// rejected client-side with the same rules the API enforces.
export const createNoteSchema = z.object({
  content: z.string().trim().min(1, "Write something before saving your note."),
  folderId: z.uuid().nullable().optional(),
  newFolder: z
    .object({
      name: z
        .string()
        .trim()
        .min(1, "Name the new folder, or cancel it to pick an existing one.")
        .max(255, "Keep the folder name under 255 characters."),
      color: z.string().trim().min(1).max(50),
    })
    .optional(),
  sourceUrl: z.url("That source URL doesn't look right.").nullable().optional(),
  sourceTitle: z.string().trim().max(500).nullable().optional(),
  faviconUrl: z.url().nullable().optional(),
  label: z
    .string()
    .trim()
    .max(100, "Keep the label under 100 characters.")
    .nullable()
    .optional(),
  tags: z.array(z.string().trim().min(1).max(100)).max(50).optional(),
});

export type ValidatedNote = z.output<typeof createNoteSchema>;
