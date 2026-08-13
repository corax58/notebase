import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

// ─── Folders ───────────────────────────────
export const folders = pgTable(
  "folders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("folders_user_idx").on(table.userId)],
);

// ─── Notes ─────────────────────────────────
export const notes = pgTable(
  "notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    folderId: uuid("folder_id").references(() => folders.id, {
      onDelete: "set null",
    }),

    content: text("content").notNull(),
    sourceUrl: text("source_url"),
    sourceTitle: text("source_title"),
    faviconUrl: text("favicon_url"),

    label: text("label"),

    archived: boolean("archived").notNull().default(false),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("notes_user_idx").on(table.userId),
    index("notes_folder_idx").on(table.folderId),
    index("notes_created_at_idx").on(table.createdAt),
  ],
);

// ─── Tags ──────────────────────────────────
export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("tags_user_name_unique").on(table.userId, table.name),
  ],
);

// ─── Note <-> Tag join table ───────────────
export const noteTags = pgTable(
  "note_tags",
  {
    noteId: uuid("note_id")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [uniqueIndex("note_tags_pk").on(table.noteId, table.tagId)],
);

// ─── Relations ──────────────────────────────
export const foldersRelations = relations(folders, ({ many }) => ({
  notes: many(notes),
}));

export const notesRelations = relations(notes, ({ one, many }) => ({
  folder: one(folders, { fields: [notes.folderId], references: [folders.id] }),
  noteTags: many(noteTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  noteTags: many(noteTags),
}));

export const noteTagsRelations = relations(noteTags, ({ one }) => ({
  note: one(notes, { fields: [noteTags.noteId], references: [notes.id] }),
  tag: one(tags, { fields: [noteTags.tagId], references: [tags.id] }),
}));
