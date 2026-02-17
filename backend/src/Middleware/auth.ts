import jwt from 'jsonwebtoken';
import 'dotenv/config';
import type { NextFunction, Request, Response } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('authentication');

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(403).json({
            message: "Unauthorized"
        });
    } else {
        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET;

        if (!token || !secret) {
            return res.status(403).json({ message: "Missing token or server misconfiguration" });
        }

        try {
            const decoded = jwt.verify(token, secret) as { useremail: string };
            if (decoded) {
                req.userEmail = decoded.useremail;
                next();
            } else {
                res.status(401).json({
                    message: 'You are not logged in'
                })
            }

        } catch (err) {
            res.status(400).json({
                message: `some err on middlware ${err}`
            })
        }
    }

}