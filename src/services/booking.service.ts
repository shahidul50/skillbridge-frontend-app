import { env } from "@/env";
import { ServiceOptions, TBooking } from "@/types";
import { TBookingParams, TBookingReciptResponse, TBookingResponse, TBookingStatsResponse } from "@/types/admin.type";
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

  getAllBookingForAdminDashboard: async (
    params?: TBookingParams,
    options?: ServiceOptions
  ) => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/bookings/admin`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, value.toString());
          }
        });
      }

      const config: RequestInit = {
        headers: {
          Cookie: cookieStore.toString(),
        },
      };

      if (options?.cache) {
        config.cache = options.cache;
      } else {
        config.cache = "no-store";
      }

      const res = await fetch(url.toString(), config);
      const result = await res.json();

      if (!res.ok) {
        return {
          error: result?.message || "Failed to fetch bookings",
          data: null,
        };
      }

      return { error: null, data: result?.data as TBookingResponse };
    } catch (err) {
      console.error(err);
      return {
        error: "Some error occurred while fetching bookings",
        data: null,
      };
    }
  },

  getBookingStatsForAdminDashboard: async () => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/bookings/admin/stats`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const result = await res.json();

      if (!res.ok) {
        return {
          error: result?.message || "Failed to fetch booking stats",
          data: null,
        };
      }

      return { error: null, data: result?.data as TBookingStatsResponse };
    } catch (err) {
      console.error(err);
      return {
        error: "Some error occurred while fetching booking stats",
        data: null,
      };
    }
  },

  getBookingReceiptForAdminDashboard: async (id: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/bookings/admin/receipt/${id}`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const result = await res.json();

      if (!res.ok) {
        return {
          error: result?.message || "Failed to fetch booking receipt",
          data: null,
        };
      }

      return { error: null, data: result?.data as TBookingReciptResponse };
    } catch (err) {
      console.error(err);
      return {
        error: "Some error occurred while fetching booking receipt",
        data: null,
      };
    }
  },
};
