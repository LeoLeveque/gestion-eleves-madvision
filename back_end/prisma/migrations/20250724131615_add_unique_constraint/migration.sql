/*
  Warnings:

  - A unique constraint covering the columns `[nomPrenom]` on the table `Eleve` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nom]` on the table `Filiere` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nom]` on the table `Fourniture` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nom]` on the table `Module` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Eleve_nomPrenom_key" ON "Eleve"("nomPrenom");

-- CreateIndex
CREATE UNIQUE INDEX "Filiere_nom_key" ON "Filiere"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Fourniture_nom_key" ON "Fourniture"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Module_nom_key" ON "Module"("nom");
