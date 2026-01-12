import { Router } from "express";
import { vehicleControllers } from "./vehicle.controller.js";

const router = Router()

router.post('/',vehicleControllers.createVehicle)
router.get('/',vehicleControllers.getVehicles)
router.get('/:vehicleId',vehicleControllers.getVehicleById)
router.put('/:vehicleId',vehicleControllers.updateVehicleById)
router.delete('/:vehicleId',vehicleControllers.deleteVehicleById)

export const vehicleRoutes = router