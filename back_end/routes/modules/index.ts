import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const moduleRouter = Router();

// GET /modules - Get all modules
moduleRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const modules = await prisma.module.findMany();
        res.json({
            data: modules,
            total: modules.length,
        });
    } catch (error) {
        next(error);
    }
});

// GET /modules/:id - Get module by ID
moduleRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID invalide' });
            return;
        }
        const moduleItem = await prisma.module.findUnique({ where: { id } });
        if (!moduleItem) {
            res.status(404).json({ message: 'Module introuvable' });
            return;
        }
        res.json(moduleItem);
    } catch (error) {
        next(error);
    }
});

// POST /modules - Create a new module
moduleRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { nom, prix } = req.body;
        if (!nom || prix === undefined) {
            res.status(400).json({ message: 'Paramètres invalides' });
            return;
        }
        const newModule = await prisma.module.create({
            data: { nom, prix: Number(prix) },
        });
        res.status(201).json(newModule);
    } catch (error) {
        next(error);
    }
});

// PUT /modules/:id - Update an existing module
moduleRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID invalide' });
            return;
        }
        const { nom, prix } = req.body;
        if (!nom || prix === undefined) {
            res.status(400).json({ message: 'Paramètres invalides' });
            return;
        }
        const updatedModule = await prisma.module.update({
            where: { id },
            data: { nom, prix: Number(prix) },
        });
        res.json(updatedModule);
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Module introuvable' });
            return;
        }
        next(error);
    }
});

// DELETE /modules/:id - Delete a module
moduleRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID invalide' });
            return;
        }
        await prisma.module.delete({ where: { id } });
        res.sendStatus(204);
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Module introuvable' });
            return;
        }
        next(error);
    }
});

export default moduleRouter;
