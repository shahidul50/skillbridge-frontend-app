import { env } from "@/env";
import { TAdminStats } from "@/types/admin.type";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const adminService = {
  getDashboardStats: async () => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/admin/dashboard-stats`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const result = await res.json();

      if (!res.ok) {
        return { error: result?.message || "Failed to fetch dashboard stats", data: null };
      }

      return { error: null, data: result?.data as TAdminStats };
    } catch (err) {
      console.error(err);
      return { error: "Some error occurred while fetching dashboard stats", data: null };
    }
  },
};
