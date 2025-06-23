import { Router, Request, Response } from "express";
import { db } from "../../db.js";

const router = Router();

router.get("/eleves-par-filiere", async (req: Request, res: Response) => {
    const stats = await db.filiere.findMany({
        select: {
            nom: true,
            _count: {
                select: { eleves: true },
            },
        },
    });

    res.json(
        stats.map((f) => ({
            filiere: f.nom,
            nombreEleves: f._count.eleves,
        }))
    );
});

router.get("/montant-total-encaisse", async (req: Request, res: Response) => {
    const result = await db.recu.aggregate({
        _sum: {
            montant: true,
        },
    });

    res.json({ montantTotal: result._sum.montant || 0 });
});

router.get("/eleves-en-retard", async (req: Request, res: Response) => {
//TODO
});

router.get("/modules-plus-suis", async (req: Request, res: Response) => {
    const modules = await db.module.findMany({
        select: {
            nom: true,
            _count: {
                select: { eleves: true },
            },
        },
        orderBy: {
            eleves: {
                _count: "desc",
            },
        },
    });

    res.json(
        modules.map((m) => ({
            module: m.nom,
            nombreEleves: m._count.eleves,
        }))
    );
});

export default router;
