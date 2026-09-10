import { z } from "zod";

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

// ─── Tags ──────────────────────────────────
export const createTagSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

export const updateTagSchema = createTagSchema;

export const addNoteTagSchema = z.object({
  tag: z.string().trim().min(1).max(100),
});
