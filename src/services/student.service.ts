import { env } from "@/env";
import { TGetDashboardMetaDataResponse, TGetRecentBookingsResponse, TGetUpcomingSessionsResponse } from "@/types/student.type";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const studentService = {
    getDashboardMetaData: async () => {
        try {
            const cookieStore = await cookies();

            const res = await fetch(`${API_URL}/students/dashboard/meta`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                cache: "no-store",
            });

            const result = await res.json();

            if (!res.ok) {
                return {
                    error: result?.message || "Failed to fetch dashboard meta data",
                    data: null,
                };
            }

            return { error: null, data: result?.data as TGetDashboardMetaDataResponse };
        } catch (err) {
            console.error(err);
            return {
                error: "Some error occurred while fetching dashboard meta data",
                data: null,
            };
        }
    },
    getDashboardUpcomingSessions: async () => {
        try {
            const cookieStore = await cookies();

            const res = await fetch(`${API_URL}/students/dashboard/upcoming-sessions`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                cache: "no-store",
            });

            const result = await res.json();

            if (!res.ok) {
                return {
                    error: result?.message || "Failed to fetch dashboard upcoming sessions",
                    data: null,
                };
            }

            return { error: null, data: result?.data as TGetUpcomingSessionsResponse };
        } catch (err) {
            console.error(err);
            return {
                error: "Some error occurred while fetching dashboard upcoming sessions",
                data: null,
            };
        }
    },
    getDashboardRecentBookings: async () => {
        try {
            const cookieStore = await cookies();

            const res = await fetch(`${API_URL}/students/dashboard/recent-bookings`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                cache: "no-store",
            });

            const result = await res.json();

            if (!res.ok) {
                return {
                    error: result?.message || "Failed to fetch dashboard recent booking data",
                    data: null,
                };
            }

            return { error: null, data: result?.data as TGetRecentBookingsResponse };
        } catch (err) {
            console.error(err);
            return {
                error: "Some error occurred while fetching dashboard recent booking data",
                data: null,
            };
        }
    },
};
