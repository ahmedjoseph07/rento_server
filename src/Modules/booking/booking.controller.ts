import { Request, Response } from "express";
import { bookingServices } from "./booking.service.js";
import { AuthenticatedRequest } from "../../Middlewares/authMiddlewares.js";

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

const getBookings = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const role = req.user.role as string
        const customerId = req.user.id as number
        const result = await bookingServices.getBookings(role, customerId);

        res.status(200).json({
            success: true,
            message:
                role === "admin"
                    ? "Bookings retrieved successfully"
                    : "Your bookings retrieved successfully",
            data: result,
        });
    } catch (err: any) {
        console.error(err)
        res.status(500).json({
            "success": false,
            "message": err.message,
            "details": err
        })
    }
}

const updateBookingById = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const bookingId = req.params.bookingId as string;
        const { status } = req.body;
        const { id: userId, role } = req.user;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status field is required",
            });
        }

        if (role === "customer" && status !== "cancelled") {
            return res.status(403).json({
                success: false,
                message: "Customers can only cancel their own bookings",
            });
        }

        if (role === "admin" && status !== "returned") {
            return res.status(403).json({
                success: false,
                message: "Admins can only mark bookings as returned",
            });
        }

        const booking = await bookingServices.getBookingById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        if (role === "customer" && booking.customer_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only cancel your own bookings",
            });
        }

        const result = await bookingServices.updateBookingById(bookingId, status);
        if (role === "admin" && status === "returned") {
            await bookingServices.updateVehicleAvailability(booking.vehicle_id, "available");
            return res.status(200).json({
                success: true,
                message: "Booking marked as returned. Vehicle is now available",
                data: {
                    ...result.rows[0],
                    vehicle: {
                        availability_status: "available",
                    },
                },
            });
        }
        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: result.rows[0],
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message,
            details: err,
        });
    }
};


export const bookingControllers = {
    createBooking,
    getBookings,
    updateBookingById
}