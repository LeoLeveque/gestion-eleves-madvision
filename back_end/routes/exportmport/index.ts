import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { db } from "../../db";
import { Request as ExpressRequest } from "express";
import csv from "csv-parser";

const router = express.Router();
const upload = multer({ dest: "uploads/", storage: multer.memoryStorage() });

router.post("/import/csv", upload.single("file"), async (req: ExpressRequest & { file: multer.File }, res) => {
    if (!req.file) {
        res.status(400).json({ error: "Aucun fichier fourni" });
        return;
    }

    const zip = new AdmZip(req.file.buffer);
    const entries = zip.getEntries();

    const csvEntry = entries.find((e) => e.entryName.endsWith(".csv"));
    if (!csvEntry){
        res.status(400).json({ error: "Fichier CSV manquant dans l'archive" });
        return;
    }

    const csvBuffer = csvEntry.getData();
    const results: any[] = [];

    const stream = require("stream");
    const readable = new stream.Readable();
    readable._read = () => {};
    readable.push(csvBuffer);
    readable.push(null);

    readable
        .pipe(csv({ separator: "," }))
        .on("data", (data: any) => results.push(data))
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
                    photoUrl,
                } = row;

                const filiereRecord = await db.filiere.upsert({
                    where: { nom: filiere },
                    update: {},
                    create: { nom: filiere },
                });

                const eleve = await db.eleve.upsert({
                    where: { nomPrenom },
                    update: {
                        telephone,
                        adresse,
                        typeCours,
                        dateNaissance: new Date(dateNaissance),
                        dateEntree: new Date(dateEntree),
                        filiereId: filiereRecord.id,
                        photoUrl: photoUrl,
                    },
                    create: {
                        nomPrenom,
                        telephone,
                        adresse,
                        typeCours,
                        dateNaissance: new Date(dateNaissance),
                        dateEntree: new Date(dateEntree),
                        filiereId: filiereRecord.id,
                        photoUrl: photoUrl,
                    },
                });

                const eleveId = eleve.id;

                await db.eleveModule.deleteMany({ where: { eleveId } });
                await db.eleveFourniture.deleteMany({ where: { eleveId } });
                await db.recu.deleteMany({ where: { eleveId } });

                const parseResources = (field: string): { nom: string, prix: number, paye: number }[] => {
                    if (!field) return [];
                    return field.split(";").map((entry) => {
                        const [nom, prix, paye] = entry.split(":");
                        return { nom, prix: Number(prix), paye: Number(paye) };
                    });
                };

                const parsedModules = parseResources(modules);
                for (const { nom, prix, paye } of parsedModules) {
                    const module = await db.module.upsert({
                        where: { nom },
                        update: prix !== undefined ? { prix } : {},
                        create: { nom, prix },
                    });

                    await db.eleveModule.create({
                        data: { eleveId, moduleId: module.id, paye },
                    });
                }

                const parsedFournitures = parseResources(fournitures);
                for (const { nom, prix, paye } of parsedFournitures) {
                    const fourniture = await db.fourniture.upsert({
                        where: { nom },
                        update: prix !== undefined ? { prix } : {},
                        create: { nom, prix },
                    });

                    await db.eleveFourniture.create({
                        data: { eleveId, fournitureId: fourniture.id, paye },
                    });
                }

                const parsedRecus = (recus || "").split(";").filter(Boolean).map((entry) => {
                    const [numero, date, montant, motif] = entry.split(":");
                    return { numero: Number(numero), date: new Date(date), montant: Number(montant), motif };
                });

                for (const recu of parsedRecus) {
                    await db.recu.create({ data: { ...recu, eleveId } });
                }
            }
        });

    for (const entry of entries) {
        if (entry.entryName.toLowerCase().endsWith(".png")) {
            const filename = entry.entryName.split("/").pop();
            if (filename) {
                const destPath = path.join(__dirname, "../../uploads", filename);
                fs.writeFileSync(destPath, entry.getData());
            }
        }
    }

    res.status(200).json({ message: "Import terminé" });
});

router.get("/export/csv", async (req, res) => {
    const eleves = await db.eleve.findMany({
        include: {
            filiere: true,
            modules: { include: { module: true } },
            fournitures: { include: { fourniture: true } },
            recus: true,
        },
    });

    const AdmZip = (await import("adm-zip")).default;
    const zip = new AdmZip();

    const rows = eleves.map((eleve) => {
        const modules = eleve.modules
            .map((m) => `${m.module.nom}:${m.module.prix}:${m.paye}`)
            .join(";");
        const fournitures = eleve.fournitures
            .map((f) => `${f.fourniture.nom}:${f.fourniture.prix}:${f.paye}`)
            .join(";");
        const recus = eleve.recus
            .map((r) => `${r.numero}:${r.date.toISOString().split("T")[0]}:${r.montant}:${r.motif}`)
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
            photoUrl: eleve.photoUrl,
        };
    });

    const header = Object.keys(rows[0]);
    const csvString = [
        header.join(","),
        ...rows.map((row) => header.map((h) => `"${row[h]}"`).join(",")),
    ].join("\n");

    zip.addFile("eleves.csv", Buffer.from(csvString, "utf-8"));

    // Ajouter toutes les photos présentes dans /uploads
    const uploadsDir = path.join(__dirname, "../../uploads");
    const allFiles = fs.readdirSync(uploadsDir);
    const pngFiles = allFiles.filter((f) => f.endsWith(".png"));

    pngFiles.forEach((filename) => {
        const fullPath = path.join(uploadsDir, filename);
        zip.addLocalFile(fullPath, "photos", filename);
    });

    const buffer = zip.toBuffer();
    res.set({
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=eleves_export.zip`,
        "Content-Length": buffer.length,
    });

    res.send(buffer);
});

export default router;