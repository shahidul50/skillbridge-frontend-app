import { env } from "@/env";
import { TAdminStatsResponse, TStudentProfileResponse, TTutorProfileResponse, TUserParams, TUserResponse } from "@/types/admin.type";
import { ServiceOptions } from "@/types";
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

      return { error: null, data: result?.data as TAdminStatsResponse };
    } catch (err) {
      console.error(err);
      return { error: "Some error occurred while fetching dashboard stats", data: null };
    }
  },
  getAllPlatformUser: async (params?: TUserParams, options?: ServiceOptions) => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/admin/users`);

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

      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }

      const res = await fetch(url.toString(), config);
      const result = await res.json();

      if (!res.ok) {
        return { error: result?.message || "Failed to fetch platform users", data: null };
      }

      return { error: null, data: result?.data as TUserResponse };
    } catch (err) {
      console.error(err);
      return { error: "Some error occurred while fetching platform users", data: null };
    }
  },
  bannedUserAccount: async (id: string, data: { isActive: boolean }) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/admin/users/toggle-status/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        return { error: result?.message || "Failed to toggle user status", data: null };
      }

      return { error: null, data: result?.data || result };
    } catch (err) {
      console.error(err);
      return { error: "Some error occurred while toggling user status", data: null };
    }
  },
  getUserProfileDetailsByUserId: async (id: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/admin/users/${id}`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const result = await res.json();

      if (!res.ok) {
        return { error: result?.message || "Failed to fetch user profile", data: null };
      }

      return { error: null, data: result?.data as TTutorProfileResponse | TStudentProfileResponse };
    } catch (err) {
      console.error(err);
      return { error: "Some error occurred while fetching user profile", data: null };
    }
  },
};
