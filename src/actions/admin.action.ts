"use server";

import { adminService } from "@/services/admin.service";

export async function getDashboardStatsAction() {
    try {
        const result = await adminService.getDashboardStats();
        return result;
    } catch (error: any) {
        return {
            error: error.message || "Failed to fetch dashboard statistics",
            data: null,
        };
    }
}
