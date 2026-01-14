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

const getBookings = async (role: string, customerId: number) => {
    if (role === "admin") {
        const result = await pool.query(`
      SELECT 
        b.id,
        b.customer_id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,
        u.name AS customer_name,
        u.email AS customer_email,
        v.vehicle_name,
        v.registration_number
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id DESC;
    `);

        const formatted = result.rows.map((b) => ({
            id: b.id,
            customer_id: b.customer_id,
            vehicle_id: b.vehicle_id,
            rent_start_date: b.rent_start_date,
            rent_end_date: b.rent_end_date,
            total_price: Number(b.total_price),
            status: b.status,
            customer: {
                name: b.customer_name,
                email: b.customer_email,
            },
            vehicle: {
                vehicle_name: b.vehicle_name,
                registration_number: b.registration_number,
            },
        }));

        return formatted;
    } else {
        const result = await pool.query(`
      SELECT 
        b.id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,
        v.vehicle_name,
        v.registration_number,
        v.type
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1
      ORDER BY b.id DESC;
    `, [customerId]);

        const formatted = result.rows.map((b) => ({
            id: b.id,
            vehicle_id: b.vehicle_id,
            rent_start_date: b.rent_start_date,
            rent_end_date: b.rent_end_date,
            total_price: Number(b.total_price),
            status: b.status,
            vehicle: {
                vehicle_name: b.vehicle_name,
                registration_number: b.registration_number,
                type: b.type,
            },
        }));

        return formatted;
    }
};

const updateBookingById = async (id: string, status: string) => {
    const result = await pool.query(
        `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
        [status, id]
    );
    return result;
};

const updateVehicleAvailability = async (vehicleId: number, status: string) => {
    await pool.query(
        `UPDATE vehicles SET availability_status = $1 WHERE id = $2`,
        [status, vehicleId]
    );
};
const getBookingById = async (id: string) => {
    const result = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [id]);
    return result.rows[0];
};

const autoReturnExpiredBookings = async () => {

    const result = await pool.query(`
    UPDATE bookings
    SET status = 'returned'
    WHERE status = 'active' AND rent_end_date < CURRENT_DATE
    RETURNING vehicle_id;
  `);

    const updatedVehicleIds = result.rows.map((row) => row.vehicle_id);

    for (const vehicleId of updatedVehicleIds) {
        await pool.query(
            `UPDATE vehicles
       SET availability_status = 'available'
       WHERE id = $1;`,
            [vehicleId]
        );
    }

    return updatedVehicleIds.length;
};



export const bookingServices = {
    createBooking,
    getBookings,
    updateBookingById,
    getBookingById,
    updateVehicleAvailability,
    autoReturnExpiredBookings
}