import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import config from "../config/index.js";


export interface AuthenticatedRequest extends Request {
    user?: any
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            "success": false,
            "message": "Unauthorized Access : Token Required"
        })
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token as string, config.jwt_secret as string)
        req.user = decoded
        next();
    } catch (err: any) {
        return res
            .status(403)
            .json({ success: false, message: "Forbidden Access: Invalid Token" });
    }
}


export const authorizeAdmin = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    if (!req.user || req.user.role !== "admin") {
        return res
            .status(403)
            .json({ success: false, message: "Access denied: Admins only" });
    }
    next();
};