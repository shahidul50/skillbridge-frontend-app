import { env } from "@/env";
import { ServiceOptions, GetTutorParams } from "@/types";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const tutorService = {
    getAllTutor: async (params?: GetTutorParams, options?: ServiceOptions) => {
        try {
            const url = new URL(`${API_URL}/tutors`);

            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        url.searchParams.append(key, value.toString());
                    }
                });
            }

            const config: RequestInit = {};

            if (options?.cache) {
                config.cache = options.cache;
            }

            if (options?.revalidate) {
                config.next = { revalidate: options.revalidate };
            }

            config.next = { ...config.next, tags: ["tutors"] };

            const res = await fetch(url.toString(), config);

            if (!res.ok) {
                const errorText = await res.text();
                console.error(`API Error (${res.status}):`, errorText);
                return { error: `Failed to fetch tutors: ${res.statusText}`, data: null }
            }

            const responseData = await res.json();
            return { error: null, data: responseData.data || responseData }
        } catch (err) {
            console.error("Fetch Error:", err)
            return { error: "Some error occurred", data: null }
        }
    },

    updateTutor: async (formData: FormData) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/tutors`, {
                method: "PUT",
                headers: {
                    Cookie: cookieStore.toString()
                },
                body: formData
            });

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to update tutor", data: null }
            }
            return { error: null, data: result }
        } catch (err) {
            console.error("Update Error:", err)
            return { error: "An unexpected error occurred", data: null }
        }
    },

    getTutorDetailsByUserId: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/tutors/profile`, {
                method: "GET",
                headers: {
                    Cookie: cookieStore.toString()
                },
                next: {
                    tags: ["tutor-profile"]
                }
            });

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to fetch tutor details", data: null }
            }
            return { error: null, data: result.data || result }
        } catch (err) {
            console.error("Fetch Tutor Error:", err)
            return { error: "An unexpected error occurred", data: null }
        }
    },
};
