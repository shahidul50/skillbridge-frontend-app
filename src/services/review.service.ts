import { env } from "@/env";
import { TCreateReviewBodyData, TCreateReviewResponse, TGetAllBookingWithReviewQueryParams, TGetAllBookingWithReviewResponse } from "@/types/review.type";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const reviewService = {
    getAllBookingWithReview: async (params: TGetAllBookingWithReviewQueryParams) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/reviews`);

            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    url.searchParams.append(key, value.toString());
                }
            });

            const res = await fetch(url.toString(), {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                cache: "no-store",
            });

            const result = await res.json();

            if (!res.ok) {
                return {
                    error: result?.message || "Failed to fetch reviews",
                    data: null,
                };
            }

            return { error: null, data: result?.data as TGetAllBookingWithReviewResponse };
        } catch (err) {
            console.error(err);
            return {
                error: "Some error occurred while fetching reviews",
                data: null,
            };
        }
    },

    createReview: async (bodyData: TCreateReviewBodyData) => {
        try {
            const cookieStore = await cookies();

            const res = await fetch(`${API_URL}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                body: JSON.stringify(bodyData),
            });

            const result = await res.json();

            if (!res.ok) {
                return {
                    error: result?.message || "Failed to create review",
                    data: null,
                };
            }

            return { error: null, data: result?.data as TCreateReviewResponse };
        } catch (err) {
            console.error(err);
            return {
                error: "Some error occurred while creating review",
                data: null,
            };
        }
    },
};