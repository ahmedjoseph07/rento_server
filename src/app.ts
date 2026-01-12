import express, { Request, Response } from "express"
import initDB from "./config/db.js"
import { authRoutes } from "./Modules/auth/auth.route.js"
import { userRoutes } from "./Modules/user/user.route.js"
import { vehicleRoutes } from "./Modules/vehicle/vehicle.route.js"

const app = express()

app.use(express.json())

initDB()

// --Auth Routes--
app.use('/api/v1/auth', authRoutes)

// User Routes
app.use('/api/v1/users', userRoutes)

// Vehhicle Routes

app.use('/api/v1/vehicles',vehicleRoutes)

app.get('/', (req: Request, res: Response) => {
    res.send("--Welcome to Rento Server--")
})

app.use((req: Request, res: Response) => {
    res.status(404).json({
        "success": false,
        "message": "Route not found",
        "path": req.originalUrl
    })
})

export default app;