import { Router, Request, Response } from "express";
import { db } from "../../db";
const eleveFournitureRouter = Router();

eleveFournitureRouter.post("/", async (req: Request, res: Response) => {
    const { eleveId, fournitureId, paye = 0 } = req.body;

    try {
        const created = await db.eleveFourniture.create({
            data: {
                eleveId,
                fournitureId,
                paye,
            },
        });
        res.status(201).json(created);
    } catch (error) {
        res.status(400).json({ error: "Erreur lors de la création", details: error });
    }
});

eleveFournitureRouter.put("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { paye } = req.body;

    try {
        const updated = await db.eleveFourniture.update({
            where: { id },
            data: { paye },
        });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: "Erreur lors de la modification", details: error });
    }
});

eleveFournitureRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        await db.eleveFourniture.delete({ where: { id } });
        res.sendStatus(204);
    } catch (error) {
        res.status(400).json({ error: "Erreur lors de la suppression", details: error });
    }
});

export default eleveFournitureRouter;
