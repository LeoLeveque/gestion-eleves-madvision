import { Router, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../../db.js";
import {AuthenticatedRequest} from "../auth";
import {checkSuperAdmin, checkAdminOrOwner} from "../auth/service";

const router = Router();

router.get("/", checkSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const admins = await db.utilisateur.findMany({
            select: {
                id: true,
                nomPrenom: true,
                isAdmin: true,
                seed: false,
                mdp: false,
            },
        });

        const result = admins.map(admin => ({
            ...admin,
        }));
        res.json({ data: result, total: result.length });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

router.post("/", checkSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
    console.log(req.body)
    const { nomPrenom, mdp, isAdmin } = req.body;
    if (!nomPrenom || !mdp) {
        res.status(400).json({ error: "nomPrenom, mdp et type d'administrateur sont requis" });
        return;
    }

    try {
        const existing = await db.utilisateur.findUnique({ where: { nomPrenom } });
        if (existing) {
            res.status(409).json({ error: "Administrateur déjà existant avec ce nom" });
            return;
        }

        const seed = `seed-${nomPrenom.toLowerCase().replace(/\s+/g, '-')}`;
        const hashed = await bcrypt.hash(mdp + seed, 10);

        const admin = await db.utilisateur.create({
            data: {
                nomPrenom,
                mdp: hashed,
                seed,
                isAdmin: isAdmin,
            },
            select: {
                id: true,
                nomPrenom: true,
                isAdmin: true,
            },
        });

        res.status(201).json({
            ...admin,
            isSuperAdmin: false,
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

router.delete("/:id", checkSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
    const id = Number(req.params.id);
    console.log(req.user.id);
    if(id == req.user.id){
        res.status(400).json({ error: "Auto suppression impossible" });
        return
    }
    if(id == 1){
        res.status(400).json({ error: "impossible de supprimer le premier utilisateur" });
        return
    }

    try {
        const adminToDelete = await db.utilisateur.findUnique({ where: { id } });
        if (!adminToDelete) {
            res.status(404).json({ error: "Admin non trouvé" });
            return;
        }

        await db.utilisateur.delete({ where: { id } });
        res.json({ message: "Admin supprimé" });
        return;
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
        return;
    }
});

router.put("/:id", checkAdminOrOwner, async (req: AuthenticatedRequest, res: Response) => {
    const idToUpdate = Number(req.params.id);
    const { nomPrenom, mdp } = req.body;

    if (isNaN(idToUpdate)) {
        res.status(400).json({ error: "ID invalide" });
        return;
    }

    try {
        const adminToUpdate = await db.utilisateur.findUnique({ where: { id: idToUpdate } });

        if (!adminToUpdate || !adminToUpdate.isAdmin) {
            res.status(404).json({ error: "Administrateur non trouvé" });
            return
        }

        if (!req.user?.isSuperAdmin) {
            if (req.user?.id !== idToUpdate) {
                res.status(403).json({ error: "Modification interdite" });
                return
            }
            if (nomPrenom && nomPrenom !== adminToUpdate.nomPrenom) {
                res.status(403).json({ error: "Admin classique ne peut modifier que son mot de passe" });
                return
            }
        }

        const dataToUpdate: { nomPrenom?: string; mdp?: string } = {};

        if (nomPrenom) {
            dataToUpdate.nomPrenom = nomPrenom;
        }

        if (mdp) {
            const seed = adminToUpdate.seed;
            dataToUpdate.mdp = await bcrypt.hash(mdp + seed, 10);
        }

        const updatedAdmin = await db.utilisateur.update({
            where: { id: idToUpdate },
            data: dataToUpdate,
            select: {
                id: true,
                nomPrenom: true,
                isAdmin: true,
            },
        });

        res.json({
            ...updatedAdmin,
            isSuperAdmin: updatedAdmin.id === 1,
        });
    } catch (error) {
        console.error("Erreur PATCH /admins/:id", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export default router;
