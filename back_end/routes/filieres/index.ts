import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const filiereRouter = Router();

// GET /filieres - Get all filieres
filiereRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filieres = await prisma.filiere.findMany();
        res.json(filieres);
    } catch (error) {
        next(error);
    }
});

// GET /filieres/:id - Get filiere by ID
filiereRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID invalide' });
            return;
        }
        const filiere = await prisma.filiere.findUnique({ where: { id } });
        if (!filiere) {
            res.status(404).json({ message: 'Filiere introuvable' });
            return;
        }
        res.json(filiere);
    } catch (error) {
        next(error);
    }
});

// POST /filieres - Create a new filiere
filiereRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { nom } = req.body;
        if (!nom) {
            res.status(400).json({ message: 'Paramètres invalides' });
            return;
        }
        const newFiliere = await prisma.filiere.create({ data: { nom } });
        res.status(201).json(newFiliere);
    } catch (error) {
        next(error);
    }
});

// PUT /filieres/:id - Update an existing filiere
filiereRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID invalide' });
            return;
        }
        const { nom } = req.body;
        if (!nom) {
            res.status(400).json({ message: 'Paramètres invalides' });
            return;
        }
        const updatedFiliere = await prisma.filiere.update({
            where: { id },
            data: { nom }
        });
        res.json(updatedFiliere);
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Filiere introuvable' });
            return;
        }
        next(error);
    }
});

// DELETE /filieres/:id - Delete a filiere
filiereRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'ID invalide' });
            return;
        }
        await prisma.filiere.delete({ where: { id } });
        res.sendStatus(204);
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Filiere introuvable' });
            return;
        }
        next(error);
    }
});

export default filiereRouter;
