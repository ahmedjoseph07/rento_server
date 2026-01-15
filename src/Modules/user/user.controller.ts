import { Request, Response } from "express";
import { userServices } from "./user.service.js";
import { AuthenticatedRequest } from "../../Middlewares/authMiddlewares.js";

const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUsers()
        res.status(200).json({
            "success": true,
            "message": "Users retrieved successfully",
            "data": result.rows
        })
    } catch (err: any) {
        console.error(err)
        res.status(500).json({
            "success": false,
            "message": err.message,
            "details": err
        })
    }
}

const updateUserById = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const id = req.params.userId as string

        const requester = req.user
        const { role: requesterRole, id: requesterId } = requester

        if (requesterRole !== "admin" && requesterId !== parseInt(id)) {
            return res.status(403).json({
                success: false,
                message: "Access denied: You can only update your own profile",
            });
        }

        if (requesterRole !== "admin" && "role" in req.body) {
            delete req.body.role;
        }

        const result = await userServices.updateUserById(req.body, id)
        res.status(200).json({
            "success": true,
            "message": "User updated successfully",
            "data": result.rows[0]
        })
    } catch (err: any) {
        console.error(err)
        res.status(500).json({
            "success": false,
            "message": err.message,
            "details": err
        })
    }
}

const deleteUserById = async (req: Request, res: Response) => {
    const id = req.params.userId as string
    try {
        const activeCount = await userServices.checkActiveBookings(id)

        if (activeCount > 0) {
            return res.status(403).json({
                success: false,
                message: "User cannot be deleted because user has active bookings",
            });
        }

        const result = await userServices.deleteUserById(id as string)
        res.status(200).json({
            "success": true,
            "message": "User deleted successfully",
        })
    } catch (err: any) {
        console.error(err)
        res.status(500).json({
            "success": false,
            "message": err.message,
            "details": err
        })
    }
}


export const userControllers = {
    getUsers,
    updateUserById,
    deleteUserById
}