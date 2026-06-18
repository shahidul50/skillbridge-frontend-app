import { env } from "@/env";
import { TGETUserProfileByIdResponse, TUpdateUserProfileByIdResponse } from "@/types/profile.type";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const profileService = {
  getUserProfileById: async () => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/profile/me`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const result = await res.json();

      if (!res.ok) {
        return { error: result?.message || "Failed to fetch user profile", data: null };
      }

      return { error: null, data: result?.data as TGETUserProfileByIdResponse };
    } catch (err) {
      console.error(err);
      return { error: "Some error occurred while fetching user profile", data: null };
    }
  },
  updateUserProfileById: async (formData: FormData) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/profile/me`, {
        method: "PUT",
        headers: {
          Cookie: cookieStore.toString(),
        },
        body: formData,
      });
      const result = await res.json();

      if (!res.ok) {
        return { error: result?.message || "Failed to update user profile", data: null };
      }

      return { error: null, data: result?.data as TUpdateUserProfileByIdResponse };
    } catch (err) {
      console.error(err);
      return { error: "Some error occurred while updating user profile", data: null };
    }
  },
};
