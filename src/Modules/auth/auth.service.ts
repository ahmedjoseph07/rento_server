import { pool } from "../../config/db.js"

const signupUser = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload
    const result = await pool.query(`
        INSERT INTO users(name,email,password,phone,role) VALUES ($1,$2,$3,$4,$5) RETURNING * `, [name, email, password, phone, role]
    )
    return result
}

export const authServices = {
    signupUser
}