ALTER TABLE "tags" ADD COLUMN "last_used_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX "tags_user_last_used_idx" ON "tags" USING btree ("user_id","last_used_at");