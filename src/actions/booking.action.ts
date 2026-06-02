"use server";

import { bookingService } from "@/services/booking.service";
import { TBooking } from "@/types";
import { TBookingParams } from "@/types/admin.type";

export async function createBookingAction(bookingData: TBooking) {
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

export async function getAllBookingForAdminDashboardAction(
  params?: TBookingParams
) {
  try {
    const result = await bookingService.getAllBookingForAdminDashboard(params);
    return result;
  } catch (error: any) {
    return {
      error: error.message || "Failed to fetch bookings",
      data: null,
    };
  }
}

export async function getBookingStatsForAdminDashboardAction() {
  try {
    const result = await bookingService.getBookingStatsForAdminDashboard();
    return result;
  } catch (error: any) {
    return {
      error: error.message || "Failed to fetch booking statistics",
      data: null,
    };
  }
}

export async function getBookingReceiptForAdminDashboardAction(id: string) {
  try {
    const result = await bookingService.getBookingReceiptForAdminDashboard(id);
    return result;
  } catch (error: any) {
    return {
      error: error.message || "Failed to fetch booking receipt",
      data: null,
    };
  }
}
