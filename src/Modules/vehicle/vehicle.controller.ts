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
        console.log("Controller", result)
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
        const result = await vehicleServices.deleteVehicleById(id)
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

export const vehicleControllers = {
    createVehicle,
    getVehicles,
    getVehicleById,
    updateVehicleById,
    deleteVehicleById
}