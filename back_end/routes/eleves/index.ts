import { Router, Request, Response } from "express";
import { db } from "../../db.js";
import { Prisma } from "@prisma/client";
import { getEleveComplet, ajouterFournitures, ajouterModules, ajouterRecus, supprimerRelationsEleve } from "./service";
import { upload } from "../../middleware/uploads";
import { UploadedFile } from "multer";
import fs from "fs";
import path from "path";


const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const {
        id,
        nomPrenom,
        telephone,
        adresse,
        typeCours,
        module,
        filiere,
        dateNaissanceFrom,
        dateNaissanceTo,
        dateEntreeFrom,
        dateEntreeTo,
        sortBy,
        sortOrder = "asc",
        secondarySortBy,
        secondarySortOrder = "asc",
        page = "1",
        pageSize = "10",
    } = req.query;

    const filters: Prisma.EleveWhereInput = {};
    if (id) filters.id = Number(id);
    if (nomPrenom) filters.nomPrenom = { contains: nomPrenom as string };
    if (telephone) filters.telephone = { contains: telephone as string };
    if (adresse) filters.adresse = { contains: adresse as string };
    if (typeCours) filters.typeCours = { equals: typeCours as string };
    if (filiere) filters.filiere = { nom: { contains: filiere as string } };
    if (module) {
        filters.modules = {
            some: { module: { nom: { contains: module as string } } },
        };
    }
    if (dateNaissanceFrom || dateNaissanceTo) {
        filters.dateNaissance = {};
        if (dateNaissanceFrom) filters.dateNaissance.gte = new Date(dateNaissanceFrom as string);
        if (dateNaissanceTo) filters.dateNaissance.lte = new Date(dateNaissanceTo as string);
    }
    if (dateEntreeFrom || dateEntreeTo) {
        filters.dateEntree = {};
        if (dateEntreeFrom) filters.dateEntree.gte = new Date(dateEntreeFrom as string);
        if (dateEntreeTo) filters.dateEntree.lte = new Date(dateEntreeTo as string);
    }

    const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);
    const take = parseInt(pageSize as string);

    try {
        const eleves = await db.eleve.findMany({
            where: filters,
            include: {
                filiere: true,
                recus: true,
                modules: { include: { module: true } },
                fournitures: { include: { fourniture: true } },
            },
            skip,
            take,
        });

        const dataWithSomme = eleves.map((eleve) => {
            const sommeModules = eleve.modules.reduce((sum, m) => sum + (m.module.prix - (m.paye || 0)), 0);
            const sommeFournitures = eleve.fournitures.reduce((sum, f) => sum + (f.fourniture.prix - (f.paye || 0)), 0);
            return { ...eleve, sommeDue: sommeModules + sommeFournitures };
        });

        if (sortBy || secondarySortBy) {
            dataWithSomme.sort((a, b) => {
                const getValue = (item: any, field: string): any => {
                    if (field === "sommeDue") return item.sommeDue;
                    return item[field];
                };
                const aVal = getValue(a, sortBy as string);
                const bVal = getValue(b, sortBy as string);
                if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
                if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
                if (secondarySortBy) {
                    const aSec = getValue(a, secondarySortBy as string);
                    const bSec = getValue(b, secondarySortBy as string);
                    if (aSec < bSec) return secondarySortOrder === "asc" ? -1 : 1;
                    if (aSec > bSec) return secondarySortOrder === "asc" ? 1 : -1;
                }
                return 0;
            });
        }

        res.json({ data: dataWithSomme, total: dataWithSomme.length });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des élèves", details: error });
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const eleve = await getEleveComplet(id);
        if (!eleve) {
            res.status(404).json({ error: "Élève introuvable" });
            return;
        }

        const sommeModules = eleve.modules.reduce((s, m) => s + (m.module.prix - (m.paye || 0)), 0);
        const sommeFournitures = eleve.fournitures.reduce((s, f) => s + (f.fourniture.prix - (f.paye || 0)), 0);

        res.json({ ...eleve, sommeDue: sommeModules + sommeFournitures });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération" });
    }
});

router.post("/", async (req: Request, res: Response) => {
    const {
        nomPrenom,
        dateNaissance,
        telephone,
        adresse,
        dateEntree,
        typeCours,
        filiereId,
        moduleIds = [],
        fournitureIds = [],
        recus = []
    } = req.body;

    try {
        const eleve = await db.eleve.create({
            data: {
                nomPrenom,
                dateNaissance: new Date(dateNaissance),
                telephone,
                adresse,
                dateEntree: new Date(dateEntree),
                typeCours,
                filiere: { connect: { id: filiereId } },
            },
        });

        await ajouterModules(eleve.id, moduleIds.map((id: number) => ({ moduleId: id })));
        await ajouterFournitures(eleve.id, fournitureIds.map((id: number) => ({ fournitureId: id })));
        await ajouterRecus(eleve.id, recus);

        const full = await getEleveComplet(eleve.id);
        res.status(201).json(full);
    } catch (error) {
        res.status(400).json({ error: "Erreur lors de la création", details: error });
    }
});

router.patch("/:id/ajouter-relations", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { modules = [], fournitures = [], recus = [] } = req.body;

    try {
        await ajouterModules(id, modules);
        await ajouterFournitures(id, fournitures);
        await ajouterRecus(id, recus);

        const updated = await getEleveComplet(id);
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: "Erreur lors de l'ajout de relations", details: error });
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const {
        nomPrenom,
        dateNaissance,
        telephone,
        adresse,
        dateEntree,
        typeCours,
        filiereId,
    } = req.body;

    try {
        await db.eleve.update({
            where: { id },
            data: {
                nomPrenom,
                dateNaissance: dateNaissance ? new Date(dateNaissance) : undefined,
                telephone,
                adresse,
                dateEntree: dateEntree ? new Date(dateEntree) : undefined,
                typeCours,
                filiereId,
            },
        });

        //await mettreAJourRelationsEleve(id, modules, fournitures, recuIds);

        const updated = await getEleveComplet(id);
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: "Erreur de mise à jour", details: error });
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        await supprimerRelationsEleve(id);
        await db.eleve.delete({ where: { id } });
        res.json({ message: "Élève supprimé" });
    } catch {
        res.status(404).json({ error: "Élève introuvable" });
    }
});

router.post(
    "/:id/photo",
    upload.single("photo"),
    async (req: Request<{ id: string }> & { file?: UploadedFile }, res: Response) => {
        const { id } = req.params;

        if (!req.file) {
            res.status(400).json({ error: "Aucune photo envoyée" });
            return;
        }

        const eleve = await db.eleve.findUnique({
            where: { id: Number(id) },
        });

        if (eleve?.photoUrl) {
            const oldPhotoPath = path.join(__dirname, "../../uploads", path.basename(eleve.photoUrl));

            fs.unlink(oldPhotoPath, (err) => {
                res.status(500).json({ error: "⚠️ Impossible de supprimer l'ancienne photo :" + err.message});

            });
        }

        const photoUrl = `/uploads/${req.file.filename}`;

        const updated = await db.eleve.update({
            where: { id: Number(id) },
            data: { photoUrl },
        });

        res.json({ message: "Photo mise à jour", photoUrl: updated.photoUrl });
        return;
    }
);


export default router;
