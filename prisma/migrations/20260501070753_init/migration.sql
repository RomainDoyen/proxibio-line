-- CreateTable
CREATE TABLE "Producteur" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nameEnterprise" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producteur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positionProducteur" (
    "id" SERIAL NOT NULL,
    "producteurId" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "marker" TEXT NOT NULL,

    CONSTRAINT "positionProducteur_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "positionProducteur" ADD CONSTRAINT "positionProducteur_producteurId_fkey" FOREIGN KEY ("producteurId") REFERENCES "Producteur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
