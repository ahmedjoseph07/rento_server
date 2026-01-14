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
    const { name, email, phone, role } = user;

    const result = await pool.query(
    `UPDATE users SET
    name = COALESCE($1, name),
    email = COALESCE($2, email),
    phone = COALESCE($3, phone),
    role = COALESCE($4, role) WHERE id = $5 RETURNING id, name, email, phone, role;
    `,
        [name || null, email || null, phone || null, role || null, id]
    );

    return result;
}


const deleteUserById = async (id: string) => {
    const result = await pool.query(`
        DELETE FROM users WHERE id=$1 RETURNING *
        `, [id])
    return result
}

const checkActiveBookings = async (customerId: string) => {
    const result = await pool.query(
        `SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'`,
        [parseInt(customerId)]
    );
    const count = result.rows.length;
    return count;
};

export const userServices = {
    getUsers,
    updateUserById,
    deleteUserById,
    checkActiveBookings
}