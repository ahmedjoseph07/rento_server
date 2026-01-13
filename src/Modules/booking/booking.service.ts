import { pool } from "../../config/db.js"

interface Booking {
    id?: string,
    customer_id: string,
    vehicle_id: string,
    rent_start_date: string,
    rent_end_date: string,
}

const createBooking = async (booking: Booking) => {
    const { vehicle_id, customer_id, rent_end_date, rent_start_date } = booking

    const vehicleInfo = await pool.query(`
        SELECT * FROM vehicles WHERE id=$1
        `, [vehicle_id])

    if (vehicleInfo.rowCount === 0) {
        throw new Error("Vehicle not found");
    }

    const { vehicle_name, daily_rent_price: dailyRentPrice } = vehicleInfo?.rows[0]

    const diffTime = new Date(rent_end_date).getTime() - new Date(rent_start_date).getTime()
    const numberOfDays = diffTime / (1000 * 60 * 60 * 24)

    if (numberOfDays <= 0) {
        throw new Error("Invalid date range: rent_end_date must be after rent_start_date");
    }

    const totalPrice = dailyRentPrice * numberOfDays
    const status = "active"

    const result = await pool.query(`
        INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *
        `, [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice, status])
    const resultWithVehcileInfo = {
        ...result?.rows[0],
        "vehicle": {
            "vehicle_name": vehicle_name,
            "daily_rent_price": dailyRentPrice
        }
    }
    return resultWithVehcileInfo
}

const getBookings = async () => {
    const result = await pool.query(`
        SELECT * FROM bookings
        `)
    return result
}

const updateBookingById = async (id: string, status: string) => {
    const result = await pool.query(`
        UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *
         `, [status,id])
    return result
}

export const bookingServices = {
    createBooking,
    getBookings,
    updateBookingById
}