-- Profil producteur étendu (photo, description, tags, produits, contact)

ALTER TABLE "Producteur" ADD COLUMN IF NOT EXISTS "profileImageUrl" TEXT;
ALTER TABLE "Producteur" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "Producteur" ADD COLUMN IF NOT EXISTS "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Producteur" ADD COLUMN IF NOT EXISTS "sellsCategories" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Producteur" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "Producteur" ADD COLUMN IF NOT EXISTS "contactEmail" TEXT;
ALTER TABLE "Producteur" ADD COLUMN IF NOT EXISTS "website" TEXT;
ALTER TABLE "Producteur" ADD COLUMN IF NOT EXISTS "instagram" TEXT;
ALTER TABLE "Producteur" ADD COLUMN IF NOT EXISTS "facebook" TEXT;
