-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'PRODUCER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "positionProducteur" DROP CONSTRAINT "positionProducteur_producteurId_fkey";

-- AlterTable
ALTER TABLE "Producteur" ADD COLUMN     "createdByUserId" TEXT,
ADD COLUMN     "ownerUserId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- AddForeignKey
ALTER TABLE "Producteur" ADD CONSTRAINT "Producteur_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producteur" ADD CONSTRAINT "Producteur_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "positionProducteur" ADD CONSTRAINT "positionProducteur_producteurId_fkey" FOREIGN KEY ("producteurId") REFERENCES "Producteur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
