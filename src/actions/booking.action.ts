"use server";

import { bookingService } from "@/services/booking.service";
import { TBooking } from "@/types";

export async function createBooking(bookingData: TBooking) {
  try {
    const result = await bookingService.createBooking(bookingData);
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create booking",
    };
  }
}
