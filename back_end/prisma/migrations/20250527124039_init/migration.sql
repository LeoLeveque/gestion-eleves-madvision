/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[telephone]` on the table `Eleve` will be added. If there are existing duplicate values, this will fail.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomPrenom" TEXT NOT NULL,
    "mdp" TEXT NOT NULL,
    "seed" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_nomPrenom_key" ON "Utilisateur"("nomPrenom");

-- CreateIndex
CREATE UNIQUE INDEX "Eleve_telephone_key" ON "Eleve"("telephone");
