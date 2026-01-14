import cron from "node-cron";
import { bookingServices } from "../Modules/booking/booking.service.js";

cron.schedule("0 0 * * *", async () => {
    try {
        const count = await bookingServices.autoReturnExpiredBookings();
        if (count > 0) {
            console.log(`Auto-returned ${count} expired bookings.`);
        } else {
            console.log("No expired bookings found today.");
        }
    } catch (err) {
        console.error("Auto-return job failed:", err);
    }
});
