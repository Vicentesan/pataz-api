ALTER TABLE "adoption_post" DROP CONSTRAINT "adoption_post_owner_id_owners_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "adoption_post_owner_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "adoption_post_status_owner_idx";--> statement-breakpoint
ALTER TABLE "adoption_post" DROP COLUMN IF EXISTS "owner_id";