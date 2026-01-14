import { Router } from "express";
import { vehicleControllers } from "./vehicle.controller.js";
import { authenticateJWT, authorizeAdmin } from "../../Middlewares/authMiddlewares.js";

const router = Router()

router.post('/', authenticateJWT,authorizeAdmin, vehicleControllers.createVehicle)
router.get('/', vehicleControllers.getVehicles)
router.get('/:vehicleId', vehicleControllers.getVehicleById)
router.put('/:vehicleId',authenticateJWT,authorizeAdmin, vehicleControllers.updateVehicleById)
router.delete('/:vehicleId',authenticateJWT,authorizeAdmin, vehicleControllers.deleteVehicleById)

export const vehicleRoutes = router