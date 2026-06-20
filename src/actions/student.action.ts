"use server";

import { studentService } from "@/services/student.service";

export async function getDashboardMetaDataAction() {
    try {
        const result = await studentService.getDashboardMetaData();
        return result;
    } catch (error: any) {
        return {
            error: error.message || "Failed to fetch dashboard meta data",
            data: null,
        };
    }
}
export async function getDashboardUpcomingSessionsAction() {
    try {
        const result = await studentService.getDashboardUpcomingSessions();
        return result;
    } catch (error: any) {
        return {
            error: error.message || "Failed to fetch dashboard upcoming sessions",
            data: null,
        };
    }
}

export async function getDashboardRecentBookingsAction() {
    try {
        const result = await studentService.getDashboardRecentBookings();
        return result;
    } catch (error: any) {
        return {
            error: error.message || "Failed to fetch dashboard recent bookings",
            data: null,
        };
    }
}
