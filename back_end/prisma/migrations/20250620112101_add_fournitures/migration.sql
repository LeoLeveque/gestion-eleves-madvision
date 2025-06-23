-- CreateTable
CREATE TABLE "Fourniture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prix" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "EleveFourniture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eleveId" INTEGER NOT NULL,
    "fournitureId" INTEGER NOT NULL,
    CONSTRAINT "EleveFourniture_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "Eleve" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EleveFourniture_fournitureId_fkey" FOREIGN KEY ("fournitureId") REFERENCES "Fourniture" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Module" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prix" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Module" ("id", "nom") SELECT "id", "nom" FROM "Module";
DROP TABLE "Module";
ALTER TABLE "new_Module" RENAME TO "Module";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
