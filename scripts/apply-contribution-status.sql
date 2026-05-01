-- À exécuter dans Neon : SQL Editor → coller → Run
-- (si prisma migrate deploy timeout à cause du pooler)
--
-- Ensuite, pour enregistrer la migration côté Prisma sans la rejouer :
--   npx prisma migrate resolve --applied 20260501080000_contribution_status
--
DO $$ BEGIN
    CREATE TYPE "ContributionStatus" AS ENUM ('APPROVED', 'PENDING', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "Producteur" ADD COLUMN IF NOT EXISTS "status" "ContributionStatus" NOT NULL DEFAULT 'APPROVED';
