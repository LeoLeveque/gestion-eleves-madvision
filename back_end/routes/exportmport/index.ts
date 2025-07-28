import express from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import { Request as ExpressRequest } from "express";

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ dest: "uploads/" });

router.post("/import/csv", upload.single("file"), async (req: ExpressRequest & { file: multer.File }, res) => {
    if (!req.file) {
        res.status(400).json({ error: "Aucun fichier fourni" });
        return
    }

    const results: any[] = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
        .pipe(csv({ separator: "," }))
        .on("data", (data) => results.push(data))
        .on("end", async () => {
            for (const row of results) {
                const {
                    nomPrenom,
                    telephone,
                    adresse,
                    typeCours,
                    dateNaissance,
                    dateEntree,
                    filiere,
                    modules,
                    fournitures,
                    recus,
                } = row;

                const filiereRecord = await prisma.filiere.upsert({
                    where: { nom: filiere },
                    update: {},
                    create: { nom: filiere },
                });

                const eleve = await prisma.eleve.upsert({
                    where: { nomPrenom },
                    update: {
                        telephone,
                        adresse,
                        typeCours,
                        dateNaissance: new Date(dateNaissance),
                        dateEntree: new Date(dateEntree),
                        filiereId: filiereRecord.id,
                    },
                    create: {
                        nomPrenom,
                        telephone,
                        adresse,
                        typeCours,
                        dateNaissance: new Date(dateNaissance),
                        dateEntree: new Date(dateEntree),
                        filiereId: filiereRecord.id,
                    },
                });

                const eleveId = eleve.id;

                await prisma.eleveModule.deleteMany({ where: { eleveId } });
                await prisma.eleveFourniture.deleteMany({ where: { eleveId } });
                await prisma.recu.deleteMany({ where: { eleveId } });

                const parseResources = (field: string): { nom: string, prix: number, paye: number }[] => {
                    if (!field) return [];
                    return field.split(";").map((entry) => {
                        const [nom, prix, paye] = entry.split(":");
                        return { nom, prix: Number(prix), paye: Number(paye) };
                    });
                };

                const parsedModules = parseResources(modules);
                for (const { nom, prix, paye } of parsedModules) {
                    const module = await prisma.module.upsert({
                        where: { nom },
                        update: prix !== undefined ? { prix } : {},
                        create: { nom, prix },
                    });

                    await prisma.eleveModule.create({
                        data: { eleveId, moduleId: module.id, paye },
                    });
                }

                const parsedFournitures = parseResources(fournitures);
                for (const { nom, prix, paye } of parsedFournitures) {
                    const fourniture = await prisma.fourniture.upsert({
                        where: { nom },
                        update: prix !== undefined ? { prix } : {},
                        create: { nom, prix },
                    });

                    await prisma.eleveFourniture.create({
                        data: { eleveId, fournitureId: fourniture.id, paye },
                    });
                }

                const parsedRecus = (recus || "").split(";").filter(Boolean).map((entry) => {
                    const [date, montant, motif] = entry.split(":");
                    return { date: new Date(date), montant: Number(montant), motif };
                });

                for (const recu of parsedRecus) {
                    await prisma.recu.create({ data: { ...recu, eleveId } });
                }
            }

            fs.unlinkSync(filePath);
            res.status(200).json({ message: "Import terminé" });
        });
});


router.get("/export/csv", async (req, res) => {

    const eleves = await prisma.eleve.findMany({
        include: {
            filiere: true,
            modules: { include: { module: true } },
            fournitures: { include: { fourniture: true } },
            recus: true,
        },
    });

    const rows = eleves.map((eleve) => {
        const modules = eleve.modules
            .map((m) => `${m.module.nom}:${m.module.prix}:${m.paye}`)
            .join(";");
        const fournitures = eleve.fournitures
            .map((f) => `${f.fourniture.nom}:${f.fourniture.prix}:${f.paye}`)
            .join(";");
        const recus = eleve.recus
            .map((r) => `${r.date.toISOString().split("T")[0]}:${r.montant}:${r.motif}`)
            .join(";");

        return {
            nomPrenom: eleve.nomPrenom,
            telephone: eleve.telephone,
            adresse: eleve.adresse,
            typeCours: eleve.typeCours,
            dateNaissance: eleve.dateNaissance.toISOString().split("T")[0],
            dateEntree: eleve.dateEntree.toISOString().split("T")[0],
            filiere: eleve.filiere.nom,
            modules,
            fournitures,
            recus,
        };
    });

    const header = Object.keys(rows[0]);
    const csvString = [
        header.join(","),
        ...rows.map((row) => header.map((h) => `"${row[h]}"`).join(",")),
    ].join("\n");

    res.setHeader("Content-Disposition", "attachment; filename=eleves.csv");
    res.setHeader("Content-Type", "text/csv");
    res.send(csvString);
});

export default router;
