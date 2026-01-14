import { Router } from "express";
import { userControllers } from "./user.controller.js";
import { authenticateJWT, authorizeAdmin } from "../../Middlewares/authMiddlewares.js";

const router = Router()

router.get('/',authenticateJWT,authorizeAdmin, userControllers.getUsers)
router.put('/:userId', userControllers.updateUserById)
router.delete('/:userId',userControllers.deleteUserById)

export const userRoutes = router