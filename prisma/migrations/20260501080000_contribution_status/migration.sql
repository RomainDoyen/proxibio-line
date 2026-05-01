-- Idempotent (Neon pooler + migrations manuelles)
DO $$ BEGIN
    CREATE TYPE "ContributionStatus" AS ENUM ('APPROVED', 'PENDING', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "Producteur" ADD COLUMN IF NOT EXISTS "status" "ContributionStatus" NOT NULL DEFAULT 'APPROVED';
