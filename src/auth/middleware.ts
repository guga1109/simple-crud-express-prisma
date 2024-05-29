import { NextFunction } from "express";
import { Request, Response } from "express";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
}