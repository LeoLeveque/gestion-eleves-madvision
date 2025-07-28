import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const eleveModuleRouter = Router();

eleveModuleRouter.post("/", async (req: Request, res: Response) => {
    const { eleveId, moduleId, paye = 0 } = req.body;

    try {
        const created = await prisma.eleveModule.create({
            data: {
                eleveId,
                moduleId,
                paye,
            },
        });
        res.status(201).json(created);
    } catch (error) {
        res.status(400).json({ error: "Erreur lors de la création", details: error });
    }
});

eleveModuleRouter.put("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { paye } = req.body;

    try {
        const updated = await prisma.eleveModule.update({
            where: { id },
            data: { paye },
        });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: "Erreur lors de la modification", details: error });
    }
});

eleveModuleRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        await prisma.eleveModule.delete({ where: { id } });
        res.sendStatus(204);
    } catch (error) {
        res.status(400).json({ error: "Erreur lors de la suppression", details: error });
    }
});

export default eleveModuleRouter;
