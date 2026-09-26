-- Keep bundles.note_order in step with bundle_items membership. Any removal
-- from bundle_items (direct, or cascaded from a note/bundle delete) drops the
-- note id from its bundle's note_order in the same transaction.
CREATE OR REPLACE FUNCTION "bundle_items_remove_from_note_order"() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE "bundles"
  SET "note_order" = array_remove("note_order", OLD."note_id")
  WHERE "id" = OLD."bundle_id";
  RETURN OLD;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER "bundle_items_after_delete"
AFTER DELETE ON "bundle_items"
FOR EACH ROW EXECUTE FUNCTION "bundle_items_remove_from_note_order"();
--> statement-breakpoint
-- One-time cleanup of ids already orphaned before the trigger existed
UPDATE "bundles" AS b
SET "note_order" = COALESCE(
  (
    SELECT array_agg(t."note_id" ORDER BY t."ord")
    FROM unnest(b."note_order") WITH ORDINALITY AS t("note_id", "ord")
    WHERE EXISTS (
      SELECT 1 FROM "bundle_items" AS bi
      WHERE bi."bundle_id" = b."id" AND bi."note_id" = t."note_id"
    )
  ),
  ARRAY[]::uuid[]
);
