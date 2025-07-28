/*
  Warnings:

  - Added the required column `numero` to the `Recu` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" INTEGER NOT NULL,
    "eleveId" INTEGER NOT NULL,
    "montant" REAL NOT NULL,
    "motif" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Recu_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "Eleve" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Recu" ("date", "eleveId", "id", "montant", "motif") SELECT "date", "eleveId", "id", "montant", "motif" FROM "Recu";
DROP TABLE "Recu";
ALTER TABLE "new_Recu" RENAME TO "Recu";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
