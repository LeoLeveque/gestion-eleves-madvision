-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EleveFourniture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eleveId" INTEGER NOT NULL,
    "fournitureId" INTEGER NOT NULL,
    "paye" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "EleveFourniture_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "Eleve" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EleveFourniture_fournitureId_fkey" FOREIGN KEY ("fournitureId") REFERENCES "Fourniture" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EleveFourniture" ("eleveId", "fournitureId", "id") SELECT "eleveId", "fournitureId", "id" FROM "EleveFourniture";
DROP TABLE "EleveFourniture";
ALTER TABLE "new_EleveFourniture" RENAME TO "EleveFourniture";
CREATE TABLE "new_EleveModule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eleveId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "paye" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "EleveModule_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "Eleve" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EleveModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EleveModule" ("eleveId", "id", "moduleId") SELECT "eleveId", "id", "moduleId" FROM "EleveModule";
DROP TABLE "EleveModule";
ALTER TABLE "new_EleveModule" RENAME TO "EleveModule";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
