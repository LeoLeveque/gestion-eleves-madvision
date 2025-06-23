import { Router, Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {verifyToken, validatePassword, findUserByNomPrenom, revokedTokens, SECRET_KEY} from "./service"

dotenv.config();

const router = Router();

export interface AuthenticatedRequest extends Request {
    user?: any;
}

router.post("/login", async (req: Request, res: Response): Promise<void> => {
    const { nomPrenom, mdp } = req.body;

    try {
        const user = await findUserByNomPrenom(nomPrenom);
        if (!user) {
            res.status(404).json({ error: "Utilisateur non trouvé" });
            return;
        }

        const isValidPassword = await validatePassword(mdp, user.mdp, user.seed);
        if (!isValidPassword) {
            res.status(401).json({ error: "Mot de passe incorrect" });
            return;
        }

        const token = jwt.sign(
            {
                id: user.id,
                nomPrenom: user.nomPrenom,
                isAdmin: user.isAdmin || false,
            },
            SECRET_KEY,
            { algorithm: "HS256", expiresIn: "30d" }
        );

        res.json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

router.post("/logout", verifyToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(403).json({ error: "Token is missing" });
        return;
    }
    if (revokedTokens.has(token)) {
        res.status(401).json({ error: "Token has already been revoked" });
        return;
    }

    revokedTokens.add(token);
    res.json({ message: "Logout successful" });
});

export default router;
