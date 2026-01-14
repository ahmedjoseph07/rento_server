import { pool } from "../../config/db.js"

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
}

const getUsers = async () => {
    const result = await pool.query(`
        SELECT id,name,email,phone,role from users
        `)
    return result
}

const updateUserById = async (user: User, id: string) => {
    const { name, email, phone, role } = user
    const result = await pool.query(`
        UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5
        RETURNING *`, [name, email, phone, role, id])
    return result
}


const deleteUserById = async (id: string) => {
    const result = await pool.query(`
        DELETE FROM users WHERE id=$1 RETURNING *
        `, [id])
        console.log("Service", result)
    return result
}

export const userServices = {
    getUsers,
    updateUserById,
    deleteUserById
}