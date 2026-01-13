import { Request, Response } from "express";
import { bookingServices } from "./booking.service.js";

const createBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingServices.createBooking(req.body)
        console.log(result)
        res.status(201).json({
            "success": true,
            "message": "Booking created successfully",
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

const getBookings = async (req: Request, res: Response) => {
    try {
        const result = await bookingServices.getBookings()
        res.status(201).json({
            "success": true,
            "message": "Booking created successfully",
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

const updateBookingById = async (req: Request, res: Response) => {
    try {
        const id = req.params.bookingId as string;
        const { status } = req.body
        const result = await bookingServices.updateBookingById(id, status)
        res.status(201).json({
            "success": true,
            "message": "Booking updated successfully",
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


export const bookingControllers = {
    createBooking,
    getBookings,
    updateBookingById
}