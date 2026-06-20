import { env } from "@/env";
import { ServiceOptions, TScheduleEventsQueryParams } from "@/types";
import { TGetDashboardMetaDataResponse, TGetRecentBookingsResponse, TGetUpcomingSessionsResponse, TSScheduleMetaDataResponse, TStudentScheduleCalendarEventResponse } from "@/types/student.type";
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
    getStudentScheduleMetaData: async (options?: ServiceOptions): Promise<{ error: string | null; data: TSScheduleMetaDataResponse | null }> => {
        try {
            const cookieStore = await cookies();

            const config: RequestInit = {
                method: "GET",
                headers: {
                    Cookie: cookieStore.toString()
                },
            };

            if (options?.cache) {
                config.cache = options.cache;
            }

            if (options?.revalidate) {
                config.next = { revalidate: options.revalidate };
            }

            config.next = { ...config.next, tags: ["student-schedule-meta"] };

            const res = await fetch(`${API_URL}/students/schedule/meta`, config);

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to fetch student schedule meta", data: null }
            }
            return { error: null, data: result.data || result }
        } catch (err) {
            console.error("Fetch Student Schedule Meta Error:", err)
            return { error: "An unexpected error occurred", data: null }
        }
    },
    getStudentScheduleEventsData: async (params: TScheduleEventsQueryParams, options?: ServiceOptions): Promise<{ error: string | null; data: TStudentScheduleCalendarEventResponse | null }> => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/students/schedule/events`);

            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        url.searchParams.append(key, value.toString());
                    }
                });
            }

            const config: RequestInit = {
                method: "GET",
                headers: {
                    Cookie: cookieStore.toString()
                },
            };

            if (options?.cache) {
                config.cache = options.cache;
            }

            if (options?.revalidate) {
                config.next = { revalidate: options.revalidate };
            }

            config.next = { ...config.next, tags: ["student-schedule-events"] };

            const res = await fetch(url.toString(), config);

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to fetch student schedule events", data: null }
            }
            return { error: null, data: result.data || result }
        } catch (err) {
            console.error("Fetch Student Schedule Events Error:", err)
            return { error: "An unexpected error occurred", data: null }
        }
    },
};
