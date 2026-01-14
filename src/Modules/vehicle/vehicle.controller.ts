import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service.js";

const createVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.createVehicle(req.body)

        res.status(201).json({
            "success": true,
            "message": "Vehicle created successfully",
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

const getVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getVehicles()

        if (result.rows.length === 0) {
            res.status(200).json({
                "success": true,
                "message": "No vehicles found",
                "data": []
            })
        }
        res.status(200).json({
            "success": true,
            "message": "Vehicles retrieved successfully",
            "data": result.rows
        })
    } catch (err: any) {
        res.status(500).json({
            "success": false,
            "message": err.message,
            "details": err
        })
    }

}

const getVehicleById = async (req: Request, res: Response) => {
    try {
        const id = req.params.vehicleId as string
        const result = await vehicleServices.getVehicleById(id)
        res.status(200).json({
            "success": true,
            "message": "Vehicle retrieved successfully",
            "data": result.rows[0]
        })
    } catch (err: any) {
        res.status(500).json({
            "success": false,
            "message": err.message,
            "details": err
        })
    }
}

const updateVehicleById = async (req: Request, res: Response) => {
    try {
        const id = req.params.vehicleId as string
        const result = await vehicleServices.updateVehicleById(req.body, id)
        res.status(200).json({
            "success": true,
            "message": "Vehicle updated successfully",
            "data": result.rows[0]
        })
    } catch (err: any) {
        res.status(500).json({
            "success": false,
            "message": err.message,
            "details": err
        })
    }
}

const deleteVehicleById = async (req: Request, res: Response) => {
    try {
        const id = req.params.vehicleId as string

        const activeCount = await vehicleServices.checkActiveBookings(id)

        if (activeCount > 0) {
            return res.status(403).json({
                success: false,
                message: "Vehicle cannot be deleted because it has active bookings",
            });
        }
        const result = await vehicleServices.deleteVehicleById(id)
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "No vehicle found with this ID",
            });
        }

        res.status(200).json({
            "success": true,
            "message": "Vehicle deleted successfully",
        })
    } catch (err: any) {
        res.status(500).json({
            "success": false,
            "message": err.message,
            "details": err
        })
    }
}

export const vehicleControllers = {
    createVehicle,
    getVehicles,
    getVehicleById,
    updateVehicleById,
    deleteVehicleById
}