ALTER TABLE "note_tags" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "note_tags" CASCADE;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "tags" text[] DEFAULT ARRAY[]::text[] NOT NULL;--> statement-breakpoint
CREATE INDEX "notes_tags_idx" ON "notes" USING gin ("tags");