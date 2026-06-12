import { env } from "@/env";
import { ServiceOptions, GetTutorParams, IWeeklyAvailableSlot, AvailabilitySlot, TDashboardMetaResponse, TDashboardRevenueTrendParams, TDashboardRevenueTrendResponse, TBookingHistoryParams, TBookingHistoryResponse, TUpdateMeetingLinkOrStatusBodyData, TBookingDetailsResponse } from "@/types";
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
            const res = await fetch(`${API_URL}/tutors/profile`, {
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

    getTutorProfileByProfileId: async (profileId: string, options?: ServiceOptions) => {
        try {
            const config: RequestInit = {};

            if (options?.cache) {
                config.cache = options.cache;
            }

            if (options?.revalidate) {
                config.next = { revalidate: options.revalidate };
            }

            config.next = { ...config.next, tags: ["tutor-profile-details"] };

            const res = await fetch(`${API_URL}/tutors/${profileId}`, config);

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to fetch tutor profile", data: null }
            }
            return { error: null, data: result.data || result }
        } catch (err) {
            console.error("Fetch Tutor Profile Error:", err)
            return { error: "An unexpected error occurred", data: null }
        }
    },

    getAvailableSlots: async (tutorProfileId: string, startDate: string, options?: ServiceOptions) => {
        try {
            const url = new URL(`${API_URL}/tutors/available-slots`);
            url.searchParams.append("tutorProfileId", tutorProfileId);
            url.searchParams.append("startDate", startDate);

            const config: RequestInit = {};

            if (options?.cache) {
                config.cache = options.cache;
            }

            if (options?.revalidate) {
                config.next = { revalidate: options.revalidate };
            }

            config.next = { ...config.next, tags: ["tutor-available-slots"] };

            const res = await fetch(url.toString(), config);

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to fetch available slots", data: null }
            }
            return { error: null, data: result.data || result }
        } catch (err) {
            console.error("Fetch Available Slots Error:", err)
            return { error: "An unexpected error occurred", data: null }
        }
    },

    getTutorSelectedCategories: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/tutors/categories`, {
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

    getWeeklyAvailableSlots: async (): Promise<{ error: string | null; data: AvailabilitySlot[] | null }> => {
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
            const res = await fetch(`${API_URL}/tutors/weekly-available-slots`, {
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
            const res = await fetch(`${API_URL}/tutors/weekly-available-slots/${slotId}`, {
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

    updateWeeklyAvailableSlot: async (slotId: string, data: { isActive: boolean }) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/tutors/weekly-available-slots/${slotId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to update weekly available slot", data: null }
            }
            return { error: null, data: result }
        } catch (err) {
            console.error("Update Weekly Available Slot Error:", err)
            return { error: "An unexpected error occurred", data: null }
        }
    },

    setTutorCategories: async (categoryIds: string[]) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/tutors/categories`, {
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
            const res = await fetch(`${API_URL}/tutors/exceptions`, {
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
            const res = await fetch(`${API_URL}/tutors/exceptions`, {
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
            const res = await fetch(`${API_URL}/tutors/exceptions/${id}`, {
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

    getDashboardMeta: async (options?: ServiceOptions): Promise<{ error: string | null; data: TDashboardMetaResponse | null }> => {
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

            config.next = { ...config.next, tags: ["tutor-dashboard-meta"] };

            const res = await fetch(`${API_URL}/tutors/dashboard/meta`, config);

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to fetch tutor dashboard meta", data: null }
            }
            return { error: null, data: result.data || result }
        } catch (err) {
            console.error("Fetch Tutor Dashboard Meta Error:", err)
            return { error: "An unexpected error occurred", data: null }
        }
    },

    getDashboardRevenueTrends: async (params: TDashboardRevenueTrendParams, options?: ServiceOptions): Promise<{ error: string | null; data: TDashboardRevenueTrendResponse | null }> => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/tutors/dashboard/revenue-trends`);

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

            config.next = { ...config.next, tags: ["tutor-dashboard-revenue-trends"] };

            const res = await fetch(url.toString(), config);

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to fetch tutor dashboard revenue trends", data: null }
            }
            return { error: null, data: result.data || result }
        } catch (err) {
            console.error("Fetch Tutor Dashboard Revenue Trends Error:", err)
            return { error: "An unexpected error occurred", data: null }
        }
    },

    getTutorAllSession: async (params: TBookingHistoryParams, options?: ServiceOptions): Promise<{ error: string | null; data: TBookingHistoryResponse | null }> => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/tutors/sessions`);

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

            config.next = { ...config.next, tags: ["tutor-sessions"] };

            const res = await fetch(url.toString(), config);

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to fetch tutor sessions", data: null }
            }
            return { error: null, data: result.data || result }
        } catch (err) {
            console.error("Fetch Tutor Sessions Error:", err)
            return { error: "An unexpected error occurred", data: null }
        }
    },

    updateBookingStatus: async (bookingId: string, data: TUpdateMeetingLinkOrStatusBodyData) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/tutors/sessions/${bookingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to update booking status or meeting link", data: null }
            }
            return { error: null, data: result }
        } catch (err) {
            console.error("Update Booking Status or Meeting Link Error:", err)
            return { error: "An unexpected error occurred", data: null }
        }
    },

    getSessionDetailsByBookingId: async (bookingId: string): Promise<{ error: string | null; data: TBookingDetailsResponse | null }> => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/tutors/session-details/${bookingId}`, {
                method: "GET",
                headers: {
                    Cookie: cookieStore.toString()
                },
                next: {
                    tags: ["session-details"]
                }
            });

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to fetch session details", data: null }
            }
            return { error: null, data: result.data || result }
        } catch (err) {
            console.error("Fetch Session Details Error:", err)
            return { error: "An unexpected error occurred", data: null }
        }
    },
};
