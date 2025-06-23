-- CreateTable
CREATE TABLE "Eleve" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomPrenom" TEXT NOT NULL,
    "dateNaissance" DATETIME NOT NULL,
    "telephone" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "dateEntree" DATETIME NOT NULL,
    "typeCours" TEXT NOT NULL,
    "filiereId" INTEGER NOT NULL,
    CONSTRAINT "Eleve_filiereId_fkey" FOREIGN KEY ("filiereId") REFERENCES "Filiere" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Filiere" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Recu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eleveId" INTEGER NOT NULL,
    "montant" REAL NOT NULL,
    "motif" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Recu_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "Eleve" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Module" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EleveModule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eleveId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,
    CONSTRAINT "EleveModule_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "Eleve" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EleveModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomPrenom" TEXT NOT NULL,
    "mdp" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nomPrenom_key" ON "User"("nomPrenom");
