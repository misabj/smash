import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "smash-burger-admin-secret-key-2026";

export interface AuthRequest extends Request {
    userId?: number;
    userRole?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Pristup odbijen. Token nije pronađen." });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch {
        res.status(401).json({ error: "Nevažeći token." });
    }
}
