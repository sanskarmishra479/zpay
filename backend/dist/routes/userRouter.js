import { Router } from "express";
import { PrismaClient } from "../generated/prisma/index.js";
import { z } from "zod";
import bcrypt from 'bcrypt';
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";
import jwt from "jsonwebtoken";
const JWT_SECRET = 'Test@123';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const client = new PrismaClient({ adapter });
const userRouter = Router();
userRouter.post('/signin', async (req, res) => {
    try {
        const requireBody = z.object({
            fName: z.string().min(3).max(20),
            lName: z.string().min(3).max(20),
            userName: z.string().min(3).max(20),
            userEmail: z.string().email().max(60),
            password: z.string().min(5).max(20)
                .refine((password) => /[A-Z]/.test(password), { message: "Required atleast one uppercase character" })
                .refine((password) => /[a-z]/.test(password), { message: "Required atleast one lowercase character" })
                .refine((password) => /[0-9]/.test(password), { message: "Required atleast one number" })
                .refine((password) => /[!@#$%^&*]/.test(password), { message: "Required atleast one special character" })
        }).strict();
        const parsedRequiredData = requireBody.safeParse(req.body);
        if (!parsedRequiredData.success) {
            res.json({
                message: "incorrect formate",
                error: parsedRequiredData.error
            });
        }
        else {
            const { fName, lName, password, userName, userEmail } = parsedRequiredData.data;
            const hasedPassword = await bcrypt.hash(password, 10);
            const user = await client.users.create({
                data: {
                    fname: fName,
                    lname: lName,
                    password: hasedPassword,
                    username: userName,
                    useremail: userEmail
                }
            });
            const useremail = user.useremail;
            const token = jwt.sign({ useremail }, JWT_SECRET);
            res.status(200).json({
                message: "register successfully",
                token
            });
        }
    }
    catch (err) {
        res.status(401).json({
            message: `some err in signin endpoint ${err}`
        });
    }
});
userRouter.post('/signup', async (req, res) => {
    try {
        const requireBody = z.object({
            userEmail: z.email().max(60),
            password: z.string().min(5).max(20)
                .refine((password) => /[A-Z]/.test(password), { message: "Required atleast one uppercase character" })
                .refine((password) => /[a-z]/.test(password), { message: "Required atleast one lowercase character" })
                .refine((password) => /[0-9]/.test(password), { message: "Required atleast one number" })
                .refine((password) => /[!@#$%^&*]/.test(password), { message: "Required atleast one special character" })
        }).strict();
        const parsedRequiredData = requireBody.safeParse(req.body);
        if (!parsedRequiredData.success) {
            res.status(401).json({
                message: 'incorrect formate',
                error: parsedRequiredData.error
            });
        }
        else {
            const { userEmail, password } = parsedRequiredData.data;
            const user = await client.users.findFirst({
                where: {
                    useremail: userEmail
                }
            });
            if (!user) {
                return res.status(401).json({
                    message: 'user not found'
                });
            }
            const matchedPassword = await bcrypt.compare(password, user.password);
            if (matchedPassword) {
                const token = jwt.sign({
                    userEmail: user.useremail.toString()
                }, JWT_SECRET);
                res.status(200).json({
                    token
                });
            }
            else {
                res.status(403).json({
                    message: "Incorrect creds"
                });
            }
        }
    }
    catch (err) {
        res.status(400).json({
            message: `error at signup endopint ${err}`
        });
    }
});
userRouter.put('/updatePassword', async (req, res) => {
});
export default userRouter;
//# sourceMappingURL=userRouter.js.map