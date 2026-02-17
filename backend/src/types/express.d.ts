import "express";

declare module "express" {
    interface Request {
        userEmail?: string;
    }
}
