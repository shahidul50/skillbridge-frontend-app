import { env } from "@/env";
import { TBooking } from "@/types";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const bookingService = {
  createBooking: async (bookingData: TBooking) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.log(err);
      throw new Error("Failed to create booking");
    }
  },
};
