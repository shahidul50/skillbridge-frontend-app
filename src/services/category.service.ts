import { env } from "@/env";
import { cookies } from "next/headers";
import { GetCategoryParams, ServiceOptions } from "@/types/categories.type";

const API_URL = env.API_URL;

export const categoryService = {
    getAllCategory: async (params?: GetCategoryParams, options?: ServiceOptions) => {
        try {
            const url = new URL(`${API_URL}/categories`);

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

            config.next = { ...config.next, tags: ["categories"] };

            const res = await fetch(url.toString(), config);

            if (!res.ok) {
                const errorText = await res.text();
                console.error(`API Error (${res.status}):`, errorText);
                return { error: `Failed to fetch categories: ${res.statusText}`, data: null }
            }

            const categories = await res.json();
            return { error: null, data: categories.data }
        } catch (err) {
            console.error("Fetch Error:", err)
            return { error: "Some error occurred", data: null }
        }
    },

    createCategory: async (formData: FormData) => {
        try {
            const cookieStore = await cookies()
            const res = await fetch(`${API_URL}/categories`, {
                method: "POST",
                headers: {
                    Cookie: cookieStore.toString()
                },
                body: formData
            });

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to create category", data: null }
            }
            return { error: null, data: result }
        } catch (err) {
            return { error: "An unexpected error occurred", data: null }
        }
    },

    updateCategory: async (id: string, formData: FormData) => {
        try {
            const cookieStore = await cookies()
            const res = await fetch(`${API_URL}/categories/${id}`, {
                method: "PATCH",
                headers: {
                    Cookie: cookieStore.toString()
                },
                body: formData
            });

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to update category", data: null }
            }
            return { error: null, data: result }
        } catch (err) {
            return { error: "An unexpected error occurred", data: null }
        }
    },

    deleteCategory: async (id: string) => {
        try {
            const cookieStore = await cookies()
            const res = await fetch(`${API_URL}/categories/${id}`, {
                method: "DELETE",
                headers: {
                    Cookie: cookieStore.toString()
                }
            });

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to delete category", data: null }
            }
            return { error: null, data: result }
        } catch (err) {
            return { error: "An unexpected error occurred", data: null }
        }
    }
}