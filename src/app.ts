import express, { Request, Response } from "express"
import initDB from "./config/db.js"
import { authRoutes } from "./Modules/auth/auth.route.js"
import { userRoutes } from "./Modules/user/user.route.js"

const app = express()

app.use(express.json())

initDB()

// --Auth Routes--
app.use('/api/v1/auth', authRoutes)

// User Routes
app.use('/api/v1/users', userRoutes)

app.get('/', (req: Request, res: Response) => {
    res.send("--Welcome to Rento Server--")
})

export default app;