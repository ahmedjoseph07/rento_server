import { Router } from "express";
import { userControllers } from "./user.controller.js";

const router = Router()

router.get('/', userControllers.getUsers)
router.put('/:userId', userControllers.updateUserById)
router.delete('/:userId',userControllers.deleteUserById)

export const userRoutes = router