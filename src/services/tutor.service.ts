import { env } from "@/env";
import { ServiceOptions, GetTutorParams } from "@/types";

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
};
