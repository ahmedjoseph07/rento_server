import { Pool } from 'pg'
import config from './index.js'

export const pool = new Pool({
    connectionString: config.connection_string
})

const initDB = async () => {
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL ,
        password TEXT NOT NULL CHECK (char_length(password) >= 6),
        phone TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin','customer')),
        CHECK (email = lower(email)) 
        )
    `)
        await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('car','bike','van','SUV')),
        registration_number VARCHAR(50) NOT NULL UNIQUE,
        daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price > 0 ),
        availability_status TEXT NOT NULL CHECK(availability_status IN ('available','booked'))
        )
    `)

        await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price NUMERIC(10,2) NOT NULL CHECK (total_price > 0),
        status TEXT NOT NULL CHECK (status IN ('active','cancelled','returned')),
        CHECK (rent_end_date > rent_start_date)
        )    
    `)
    } catch (err: any) {
        console.error("Database Initialization failed", err)
    }
}

export default initDB
