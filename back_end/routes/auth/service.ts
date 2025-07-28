import bcrypt from "bcrypt";
import {NextFunction, Response} from "express";
import {db} from "../../db";
import jwt from "jsonwebtoken";
import {AuthenticatedRequest} from "./index";

export const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key";
export const revokedTokens = new Set<string>();

export const validatePassword = async (
    inputPassword: string,
    hashedPassword: string,
    seed: string
): Promise<boolean> => {
    return bcrypt.compare(inputPassword + seed, hashedPassword);
};

export function checkSuperAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (req.user?.isAdmin) {
        next();
    } else {
        res.status(403).json({ error: "Accès refusé : super admins requis." });
    }
}
export function checkAdminOrOwner(req: AuthenticatedRequest, res: Response, next: NextFunction): void {

    const user = req.user;
    const targetId = Number(req.params.id);

    if (!user) {
        res.status(401).json({ error: "Non authentifié" });
        return;
    }

    if (user.isSuperAdmin) {
        next();
        return;
    }

    if (user.isAdmin || user.id === targetId) {
        next();
        return;
    }

    res.status(403).json({ error: "Accès refusé" });
    return;
}
export const findUserByNomPrenom = async (nomPrenom: string) => {
    return db.utilisateur.findUnique({
        where: { nomPrenom },
    });
};
export const verifyToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ error: "Token is missing" });
        return;
    }

    if (revokedTokens.has(token)) {
        res.status(401).json({ error: "Token has been revoked" });
        return;
    }

    try {
        req.user = jwt.verify(token, SECRET_KEY);
        next();
    } catch (err: any) {
        if (err.name === "TokenExpiredError") {
            res.status(401).json({ error: "Token expired, please log in again" });
        } else {
            res.status(401).json({ error: "Invalid token" });
        }
    }
};