import { z } from "zod";
import { NOTES_MAX_BATCH } from "@/lib/note-filters";

// ─── Folders ───────────────────────────────
export const createFolderSchema = z.object({
  name: z.string().trim().min(1).max(255),
  color: z.string().trim().min(1).max(50).nullable().optional(),
});

export const updateFolderSchema = createFolderSchema.partial();

// ─── Notes ─────────────────────────────────
export const createNoteSchema = z.object({
  content: z.string().trim().min(1),
  folderId: z.uuid().nullable().optional(),
  sourceUrl: z.url().nullable().optional(),
  sourceTitle: z.string().trim().max(500).nullable().optional(),
  faviconUrl: z.url().nullable().optional(),
  label: z.string().trim().max(100).nullable().optional(),
  archived: z.boolean().optional(),
  tags: z.array(z.string().trim().min(1).max(100)).max(50).optional(),
});

export const updateNoteSchema = createNoteSchema.partial();

export const listNotesQuerySchema = z.object({
  folderId: z.uuid().optional(),
  archived: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  label: z.string().min(1).optional(),
  tag: z.string().min(1).optional(),
  q: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

// Which stretch of a notes search to return; the filters themselves are read
// the way the notes page reads its own URL
export const searchNotesRangeSchema = z.object({
  limit: z.coerce.number().int().min(1).max(NOTES_MAX_BATCH),
  offset: z.coerce.number().int().min(0),
});

// ─── Bundles ───────────────────────────────
export const MAX_BUNDLE_NOTES = 500;

const bundleNoteIdsSchema = z
  .array(z.uuid())
  .max(MAX_BUNDLE_NOTES)
  .refine((ids) => new Set(ids).size === ids.length, {
    message: "A note can only be added to a bundle once",
  });

export const createBundleSchema = z.object({
  name: z.string().trim().min(1).max(255),
  // Ordered — becomes the bundle's noteOrder
  noteIds: bundleNoteIdsSchema.default([]),
});

// Must list exactly the bundle's current notes — reorders, never changes membership
export const reorderBundleNotesSchema = z.object({
  noteIds: bundleNoteIdsSchema,
});

export const addBundleNotesSchema = z.object({
  noteIds: bundleNoteIdsSchema.min(1),
  // Index in noteOrder to insert at; omitted (or past the end) appends
  position: z.number().int().min(0).optional(),
});

export const updateBundleSchema = z.object({
  name: z.string().trim().min(1).max(255).optional(),
  docContent: z.string().optional(),
  noteIds: bundleNoteIdsSchema.optional(),
});

// ─── Compile ───────────────────────────────
export const compileSettingsSchema = z.object({
  includeTitle: z.boolean(),
  labels: z.enum(["none", "heading"]),
  quoteStyle: z.enum(["plain", "blockquote"]),
  sources: z.enum(["none", "inline", "footnoted"]),
  includeTags: z.boolean(),
  separator: z.enum(["none", "blank", "rule"]),
});

export type CompileSettings = z.infer<typeof compileSettingsSchema>;

export const DEFAULT_COMPILE_SETTINGS: CompileSettings = {
  includeTitle: true,
  labels: "heading",
  quoteStyle: "blockquote",
  sources: "footnoted",
  includeTags: false,
  separator: "rule",
};

// lastCompileSettings is stored as JSON text; anything unreadable (or from an
// older shape) falls back to the defaults rather than failing the dialog
export function parseCompileSettings(raw: string | null): CompileSettings {
  if (!raw) return DEFAULT_COMPILE_SETTINGS;
  try {
    const result = compileSettingsSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : DEFAULT_COMPILE_SETTINGS;
  } catch {
    return DEFAULT_COMPILE_SETTINGS;
  }
}
