"use server";
import { revalidatePath } from "next/cache";

import { adminService } from "@/services/admin.service";
import { TUserParams } from "@/types/admin.type";

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

export async function getAllPlatformUserAction(params?: TUserParams) {
    try {
        const result = await adminService.getAllPlatformUser(params, { cache: "no-store" });
        return result;
    } catch (error: any) {
        return {
            error: error.message || "Failed to fetch platform users",
            data: null,
        };
    }
}

export async function bannedUserAccountAction(id: string, data: { isActive: boolean }) {
    try {
        const result = await adminService.bannedUserAccount(id, data);
        if (!result.error) {
            revalidatePath("/admin-dashboard/users");
        }
        return result;
    } catch (error: any) {
        return {
            error: error.message || "Failed to toggle user status",
            data: null,
        };
    }
}

export async function getUserProfileDetailsByUserIdAction(id: string) {
    try {
        const result = await adminService.getUserProfileDetailsByUserId(id);
        return result;
    } catch (error: any) {
        return {
            error: error.message || "Failed to fetch user profile",
            data: null,
        };
    }
}



