import { Router, Request, Response } from "express";
import { db } from "../../db.js";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
    try {
        const recus = await db.recu.findMany({ include: { eleve: true } });
        res.json(recus);
    } catch (e) {
        res.status(500).json({ error: "Erreur lors de la récupération des reçus" });
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const { eleveId, numero, montant, motif } = req.body;
        const recu = await db.recu.create({
            data: { eleveId, numero, montant, motif }
        });
        res.status(201).json(recu);
    } catch (e) {
        res.status(400).json({ error: "Erreur lors de la création du reçu" });
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const recu = await db.recu.findUnique({ where: { id } });
        res.json(recu);
    } catch (e) {
        res.status(404).json({ error: "Reçu non trouvé" });
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { montant, motif, numero } = req.body;
        const recu = await db.recu.update({
            where: { id },
            data: { montant, motif, numero },
        });
        res.json(recu);
    } catch (e) {
        res.status(404).json({ error: "Reçu non trouvé ou erreur de mise à jour" });
    }
});


router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await db.recu.delete({ where: { id } });
        res.json({ message: "Reçu supprimé" });
    } catch (e) {
        res.status(404).json({ error: "Reçu introuvable ou déjà supprimé" });
    }
});

export default router;
