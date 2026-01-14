import { Router } from "express";
import { bookingControllers } from "./booking.controller.js";
import { authenticateJWT } from "../../Middlewares/authMiddlewares.js";

const router = Router()

router.post('/', authenticateJWT, bookingControllers.createBooking)
router.get('/',authenticateJWT, bookingControllers.getBookings)
router.put('/:bookingId',authenticateJWT, bookingControllers.updateBookingById)

export const bookingRoutes = router