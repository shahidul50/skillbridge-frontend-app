"use server";

import { bookingService } from "@/services/booking.service";
import {
  TBooking,
  TGetAllBookingByStudentIdQueryParams,
} from "@/types";
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

export async function getAllBookingByStudentIdAction(
  params: TGetAllBookingByStudentIdQueryParams
) {
  try {
    const result = await bookingService.getAllBookingByStudentId(params);
    
    if (result?.error) {
      if (result.error === "Booking not found" || result.error.includes("not found") || result.error.includes("No bookings")) {
        return {
          error: null,
          data: {
            bookings: [],
            pagination: {
              total: 0,
              page: Number(params.page) || 1,
              limit: Number(params.limit) || 10,
              totalPages: 1
            }
          }
        };
      }
      
      console.error("getAllBookingByStudentId Error:", {
        error: result.error,
        params,
      });
    }
    
    return result;
  } catch (error: any) {
    console.error("getAllBookingByStudentId Exception:", error);
    return {
      error: error.message || "Failed to fetch student bookings",
      data: null,
    };
  }
}

export async function getBookingsMetaDataByStudentIdAction() {
  try {
    const result = await bookingService.getBookingsMetaDataByStudentId();
    
    if (result?.error) {
      if (result.error === "Booking not found" || result.error.includes("not found")) {
        return {
          error: null,
          data: {
            totalInvestment: 0,
            learningHours: "0 hrs",
            completedSessions: "0"
          }
        };
      }
      
      console.error("getBookingsMetaDataByStudentId Error:", result.error);
    }
    
    return result;
  } catch (error: any) {
    console.error("getBookingsMetaDataByStudentId Exception:", error);
    return {
      error: error.message || "Failed to fetch student bookings meta",
      data: null,
    };
  }
}

export async function getBookingReciptByBookingIdAction(bookingId: string) {
  try {
    const result = await bookingService.getBookingReciptByBookingId(bookingId);
    return result;
  } catch (error: any) {
    return {
      error: error.message || "Failed to fetch booking receipt",
      data: null,
    };
  }
}
