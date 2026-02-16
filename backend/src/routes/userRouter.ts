import { Router } from "express";
import { PrismaClient } from "../generated/prisma/index.js";

const client = new PrismaClient();
const userRouter = Router();

userRouter.post('/signin', async(req, res)=>{

})

userRouter.post('/signup', async(req, res)=>{

})

userRouter.put('/updatePassword', async(req, res)=>{

})

export default userRouter;