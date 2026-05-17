import { env } from "@/env";
import { ServiceOptions, GetTutorParams, IWeeklyAvailableSlot } from "@/types";
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

    getTutorSelectedCategories: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/tutors/my-categories`, {
                method: "GET",
                headers: {
                    Cookie: cookieStore.toString()
                },
                next: {
                    tags: ["tutor-selected-categories"]
                }
            });

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to fetch tutor selected categories", data: null }
            }
            return { error: null, data: result.data || result }
        } catch (err) {
            console.error("Fetch Tutor Selected Categories Error:", err)
            return { error: "An unexpected error occurred", data: null }
        }
    },

    getWeeklyAvailableSlots: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/tutors/weekly-available-slots`, {
                method: "GET",
                headers: {
                    Cookie: cookieStore.toString()
                },
                next: {
                    tags: ["tutor-weekly-available-slots"]
                }
            });

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to fetch tutor weekly available slots", data: null }
            }
            return { error: null, data: result.data || result }
        } catch (err) {
            console.error("Fetch Tutor Weekly Available Slots Error:", err)
            return { error: "An unexpected error occurred", data: null }
        }
    },

    createWeeklyAvailableSlot: async (data: IWeeklyAvailableSlot) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/tutors/weekly-available`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to create weekly available slot", data: null }
            }
            return { error: null, data: result }
        } catch (err) {
            console.error("Create Weekly Available Slot Error:", err)
            return { error: "An unexpected error occurred", data: null }
        }
    },

    deleteWeeklyAvailableSlot: async (slotId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/tutors/weekly-available/${slotId}`, {
                method: "DELETE",
                headers: {
                    Cookie: cookieStore.toString()
                }
            });

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to delete weekly available slot", data: null }
            }
            return { error: null, data: result }
        } catch (err) {
            console.error("Delete Weekly Available Slot Error:", err)
            return { error: "An unexpected error occurred", data: null }
        }
    },

    setTutorCategories: async (categoryIds: string[]) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/tutors/add-categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify({ categoryId: categoryIds })
            });

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to set tutor categories", data: null }
            }
            return { error: null, data: result }
        } catch (err) {
            console.error("Set Tutor Categories Error:", err)
            return { error: "An unexpected error occurred", data: null }
        }
    },

    createTutorException: async (data: { date: string; reason: string }) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/tutors/exception`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to create tutor exception", data: null }
            }
            return { error: null, data: result }
        } catch (err) {
            console.error("Create Tutor Exception Error:", err)
            return { error: "An unexpected error occurred", data: null }
        }
    },

    getAllTutorException: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/tutors/exception`, {
                method: "GET",
                headers: {
                    Cookie: cookieStore.toString()
                },
                next: {
                    tags: ["tutor-exceptions"]
                }
            });

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to fetch tutor exceptions", data: null }
            }
            return { error: null, data: result.data || result }
        } catch (err) {
            console.error("Fetch Tutor Exceptions Error:", err)
            return { error: "An unexpected error occurred", data: null }
        }
    },

    deleteTutorException: async (id: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/tutors/exception/${id}`, {
                method: "DELETE",
                headers: {
                    Cookie: cookieStore.toString()
                }
            });

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to delete tutor exception", data: null }
            }
            return { error: null, data: result }
        } catch (err) {
            console.error("Delete Tutor Exception Error:", err)
            return { error: "An unexpected error occurred", data: null }
        }
    },
};
