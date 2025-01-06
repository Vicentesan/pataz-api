CREATE TYPE "public"."adoption_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."contact_preference" AS ENUM('EMAIL', 'PHONE', 'BOTH');--> statement-breakpoint
CREATE TYPE "public"."organization_status" AS ENUM('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE');--> statement-breakpoint
CREATE TYPE "public"."species" AS ENUM('DOG', 'CAT', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."temperament" AS ENUM('FRIENDLY', 'SHY', 'ACTIVE', 'CALM', 'PROTECTIVE');--> statement-breakpoint
ALTER TABLE "authors" RENAME TO "owners";--> statement-breakpoint
ALTER TABLE "adoption_post" DROP CONSTRAINT "adoption_post_author_id_authors_id_fk";
--> statement-breakpoint
ALTER TABLE "adoption_post" DROP CONSTRAINT "adoption_post_pet_id_pets_id_fk";
--> statement-breakpoint
ALTER TABLE "owners" DROP CONSTRAINT "authors_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "owners" DROP CONSTRAINT "authors_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_members" DROP CONSTRAINT "organization_members_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_members" DROP CONSTRAINT "organization_members_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "name" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "name" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "adoption_post" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "adoption_post" ADD COLUMN "costs" jsonb;--> statement-breakpoint
ALTER TABLE "adoption_post" ADD COLUMN "status" "adoption_status" DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "adoption_post" ADD COLUMN "contact_preference" "contact_preference" DEFAULT 'BOTH' NOT NULL;--> statement-breakpoint
ALTER TABLE "adoption_post" ADD COLUMN "owner_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "phone_number" varchar(20);--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "website" varchar(255);--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "address" jsonb;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "social_media" jsonb;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "operating_hours" jsonb;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "status" "organization_status" DEFAULT 'PENDING_VERIFICATION' NOT NULL;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "species" "species" NOT NULL;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "breed" varchar(100);--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "color" varchar(50);--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "weight" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "gender" "gender" NOT NULL;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "date_of_birth" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "photos" text[];--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "health_info" jsonb;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "is_castrated" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "is_available" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "temperament" "temperament" NOT NULL;--> statement-breakpoint
ALTER TABLE "pets" ADD COLUMN "owner_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone_number" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "notification_preferences" jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_login_at" timestamp with time zone;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "adoption_post" ADD CONSTRAINT "adoption_post_owner_id_owners_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."owners"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "adoption_post" ADD CONSTRAINT "adoption_post_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "owners" ADD CONSTRAINT "owners_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "owners" ADD CONSTRAINT "owners_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organizations" ADD CONSTRAINT "organizations_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pets" ADD CONSTRAINT "pets_owner_id_owners_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."owners"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organizations_owner_id_idx" ON "organizations" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organizations_email_idx" ON "organizations" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organizations_status_idx" ON "organizations" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organizations_city_state_idx" ON "organizations" USING btree ("address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pets_owner_id_idx" ON "pets" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pets_species_idx" ON "pets" USING btree ("species");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pets_breed_idx" ON "pets" USING btree ("breed");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pets_temperament_idx" ON "pets" USING btree ("temperament");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pets_created_at_idx" ON "pets" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pets_filter_idx" ON "pets" USING btree ("species","size","gender");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_provider_id_idx" ON "users" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_phone_number_idx" ON "users" USING btree ("phone_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_auth_idx" ON "users" USING btree ("provider","provider_id");--> statement-breakpoint
ALTER TABLE "adoption_post" DROP COLUMN IF EXISTS "author_id";--> statement-breakpoint
ALTER TABLE "pets" DROP COLUMN IF EXISTS "age";--> statement-breakpoint
ALTER TABLE "pets" DROP COLUMN IF EXISTS "is_active";