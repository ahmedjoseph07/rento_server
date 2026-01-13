import { Router } from "express";
import { bookingControllers } from "./booking.controller.js";

const router = Router()

router.post('/',bookingControllers.createBooking)
router.get('/',bookingControllers.getBookings)
router.put('/:bookingId',bookingControllers.updateBookingById)

export const bookingRoutes = router