import { relations, sql } from "drizzle-orm";
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

    tags: text("tags")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),

    archived: boolean("archived").notNull().default(false),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("notes_user_idx").on(table.userId),
    index("notes_folder_idx").on(table.folderId),
    index("notes_created_at_idx").on(table.createdAt),
    index("notes_tags_idx").using("gin", table.tags), // for @> containment queries
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
    name: text("name").notNull(), // store normalized, e.g. lowercase
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("tags_user_name_unique").on(table.userId, table.name),
  ],
);

// ─── Relations ──────────────────────────────
export const foldersRelations = relations(folders, ({ many }) => ({
  notes: many(notes),
}));

export const notesRelations = relations(notes, ({ one, many }) => ({
  folder: one(folders, { fields: [notes.folderId], references: [folders.id] }),
}));
