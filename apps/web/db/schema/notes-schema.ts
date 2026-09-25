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

    label: text("label"), // note title, shown when a bundle's compile settings include labels

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
// Autocomplete source only — not a managed taxonomy. Populated from whatever
// users type into notes.tags; not directly referenced by notes.tags itself.
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

// ─── Bundles ───────────────────────────────
export const bundles = pgTable(
  "bundles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    name: text("name").notNull(),

    // Ordered list of note IDs — the display/compile order. Source of truth
    // for sequence; membership itself is owned by bundleItems. Reconciled
    // against bundleItems on read (see getBundleWithNotes) rather than kept
    // in lockstep on every write, to sidestep the cascade-delete gap.
    noteOrder: uuid("note_order")
      .array()
      .notNull()
      .default(sql`ARRAY[]::uuid[]`),

    // Compiled output — null until first Compile, overwritten on Recompile
    docContent: text("doc_content"),
    compiledAt: timestamp("compiled_at"),

    // Settings used for the most recent compile (JSON), so Recompile can
    // default to last-used settings instead of starting blank
    lastCompileSettings: text("last_compile_settings"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("bundles_user_idx").on(table.userId)],
);

// ─── Bundle Items ───────────────────────────
// Membership only — no ordering here. Guarantees referential integrity
// (FK + cascade) that noteOrder, as a plain array, can't enforce on its own.
export const bundleItems = pgTable(
  "bundle_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bundleId: uuid("bundle_id")
      .notNull()
      .references(() => bundles.id, { onDelete: "cascade" }),
    noteId: uuid("note_id")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("bundle_items_bundle_idx").on(table.bundleId),
    index("bundle_items_note_idx").on(table.noteId), // "which bundles is this note in"
    uniqueIndex("bundle_items_bundle_note_unique").on(
      table.bundleId,
      table.noteId,
    ), // same note can't be added twice to one bundle
  ],
);

// ─── Relations ──────────────────────────────
export const foldersRelations = relations(folders, ({ many }) => ({
  notes: many(notes),
}));

export const notesRelations = relations(notes, ({ one, many }) => ({
  folder: one(folders, { fields: [notes.folderId], references: [folders.id] }),
  bundleItems: many(bundleItems),
}));

export const bundlesRelations = relations(bundles, ({ one, many }) => ({
  user: one(user, { fields: [bundles.userId], references: [user.id] }),
  items: many(bundleItems),
}));

export const bundleItemsRelations = relations(bundleItems, ({ one }) => ({
  bundle: one(bundles, {
    fields: [bundleItems.bundleId],
    references: [bundles.id],
  }),
  note: one(notes, { fields: [bundleItems.noteId], references: [notes.id] }),
}));
