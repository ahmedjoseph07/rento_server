import { pool } from "../../config/db.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from "../../config/index.js"

const signupUser = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload

    const hashedPassword = await bcrypt.hash(password as string, 10)
    const result = await pool.query(`
        INSERT INTO users(name,email,password,phone,role) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, phone, role `, [name, email, hashedPassword, phone, role]
    )
    return result
}

const signinUser = async (email: string, password: string) => {
    const result = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [email])

    if (result.rows.length === 0) {
        return null
    }

    const user = result.rows[0]

    const matched = await bcrypt.compare(password, user.password)

    if (!matched) {
        return false
    }

    const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
    }

    const jwtSecret = config.jwt_secret as string
    const token = jwt.sign(safeUser, jwtSecret, { expiresIn: '7d' })

    return { token, user: safeUser }
}

export const authServices = {
    signupUser,
    signinUser
}

