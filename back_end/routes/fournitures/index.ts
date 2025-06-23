import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const fournitureRouter = Router();

// GET /fournitures - Get all fournitures
fournitureRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fournitures = await prisma.fourniture.findMany();
        res.json(fournitures);
    } catch (error) {
        next(error);
    }
});

// GET /fournitures/:id - Get fourniture by ID
fournitureRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID invalide' });
            return;
        }
        const fourniture = await prisma.fourniture.findUnique({ where: { id } });
        if (!fourniture) {
            res.status(404).json({ message: 'Fourniture introuvable' });
            return;
        }
        res.json(fourniture);
    } catch (error) {
        next(error);
    }
});

// POST /fournitures - Create a new fourniture
fournitureRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { nom, prix } = req.body;
        if (!nom || prix === undefined) {
            res.status(400).json({ message: 'Paramètres invalides' });
            return;
        }
        const newFourniture = await prisma.fourniture.create({ data: { nom, prix } });
        res.status(201).json(newFourniture);
    } catch (error) {
        next(error);
    }
});

// PUT /fournitures/:id - Update an existing fourniture
fournitureRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
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
        const updatedFourniture = await prisma.fourniture.update({
            where: { id },
            data: { nom, prix }
        });
        res.json(updatedFourniture);
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Fourniture introuvable' });
            return;
        }
        next(error);
    }
});

// DELETE /fournitures/:id - Delete a fourniture
fournitureRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID invalide' });
            return;
        }
        await prisma.fourniture.delete({ where: { id } });
        res.sendStatus(204);
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Fourniture introuvable' });
            return;
        }
        next(error);
    }
});

export default fournitureRouter;
