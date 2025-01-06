ALTER TABLE "pets" RENAME COLUMN "photos" TO "media";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "adoption_post_status_idx" ON "adoption_post" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "adoption_post_owner_id_idx" ON "adoption_post" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "adoption_post_pet_id_idx" ON "adoption_post" USING btree ("pet_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "adoption_post_created_at_idx" ON "adoption_post" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "adoption_post_status_owner_idx" ON "adoption_post" USING btree ("status","owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "org_members_organization_id_idx" ON "organization_members" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "org_members_user_id_idx" ON "organization_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "org_members_role_idx" ON "organization_members" USING btree ("role");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "org_members_org_user_role_idx" ON "organization_members" USING btree ("organization_id","user_id","role");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organizations_name_idx" ON "organizations" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organizations_phone_idx" ON "organizations" USING btree ("phone_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organizations_status_created_idx" ON "organizations" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pets_available_species_idx" ON "pets" USING btree ("is_available","species");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pets_date_of_birth_idx" ON "pets" USING btree ("date_of_birth");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pets_weight_idx" ON "pets" USING btree ("weight");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pets_available_size_idx" ON "pets" USING btree ("is_available","size");