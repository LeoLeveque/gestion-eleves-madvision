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
    try {
        const eleves = await db.eleve.findMany({
            include: {
                modules: {
                    include: { module: true }
                },
                fournitures: {
                    include: { fourniture: true }
                }
            }
        });

        const elevesEnRetard: { nomPrenom: string; sommeDue: number }[] = [];

        for (const eleve of eleves) {
            let total = 0;
            let paye = 0;

            for (const m of eleve.modules) {
                total += m.module.prix;
                paye += m.paye;
            }

            for (const f of eleve.fournitures) {
                total += f.fourniture.prix;
                paye += f.paye;
            }

            const sommeDue = total - paye;

            if (sommeDue > 0) {
                elevesEnRetard.push({
                    nomPrenom: eleve.nomPrenom,
                    sommeDue
                });
            }
        }

        const montantTotalDu = elevesEnRetard.reduce((acc, e) => acc + e.sommeDue, 0);

        res.json({
            nombreEleves: elevesEnRetard.length,
            montantTotalDu,
            eleves: elevesEnRetard
        });
    } catch (error) {
        console.error("Erreur /eleves-en-retard", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
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
