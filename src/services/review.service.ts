import { env } from "@/env";
import { TCreateReviewBodyData, TCreateReviewResponse, TGetAllBookingWithReviewQueryParams, TGetAllBookingWithReviewResponse, TGetAllReviewStatsByTutorProfileIdResponse, TGetAllReviewByTutorProfileIdQueryParams, TGetAllReviewByTutorProfileIdResponse } from "@/types/review.type";
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

    getAllReviewStatsByTutorProfileId: async (tutorProfileId: string) => {
        try {
            const res = await fetch(`${API_URL}/reviews/${tutorProfileId}/review-stats`, {
                next: { tags: ["tutor-profile-details"] }
            });

            const result = await res.json();

            if (!res.ok) {
                return {
                    error: result?.message || "Failed to fetch review stats",
                    data: null,
                };
            }

            return { error: null, data: result?.data as TGetAllReviewStatsByTutorProfileIdResponse };
        } catch (err) {
            console.error(err);
            return {
                error: "Some error occurred while fetching review stats",
                data: null,
            };
        }
    },

    getAllReviewByTutorProfileId: async (tutorProfileId: string, params: TGetAllReviewByTutorProfileIdQueryParams) => {
        try {
            const url = new URL(`${API_URL}/reviews/${tutorProfileId}/reviews`);

            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    url.searchParams.append(key, value.toString());
                }
            });

            const res = await fetch(url.toString(), {
                next: { tags: ["tutor-profile-details"] }
            });

            const result = await res.json();

            if (!res.ok) {
                return {
                    error: result?.message || "Failed to fetch reviews",
                    data: null,
                };
            }

            return { error: null, data: result?.data as TGetAllReviewByTutorProfileIdResponse };
        } catch (err) {
            console.error(err);
            return {
                error: "Some error occurred while fetching reviews",
                data: null,
            };
        }
    },
};