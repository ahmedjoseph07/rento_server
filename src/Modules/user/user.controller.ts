import { Request, Response } from "express";
import { userServices } from "./user.service.js";

const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUsers()
        console.log(result)
        res.status(200).json({
            "success": true,
            "message": "Users retrieved successfully",
            "data": result
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

const updateUserById = async (req: Request, res: Response) => {
    try {
        const id = req.params.userId as string
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
    const id = req.params.userId
    try {
        const result = await userServices.deleteUserById(id as string)
        console.log("Controller", result)
        res.status(200).json({
            "success": true,
            "message": "User deleted successfully",

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


export const userControllers = {
    getUsers,
    updateUserById,
    deleteUserById
}