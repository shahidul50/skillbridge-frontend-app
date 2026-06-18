"use server";

import { reviewService } from "@/services/review.service";
import { TCreateReviewBodyData, TGetAllBookingWithReviewQueryParams } from "@/types/review.type";

export async function getAllBookingWithReviewAction(
  params: TGetAllBookingWithReviewQueryParams
) {
  try {
    const result = await reviewService.getAllBookingWithReview(params);
    return result;
  } catch (error: any) {
    return {
      error: error.message || "Failed to fetch reviews",
      data: null,
    };
  }
}

export async function createReviewAction(bodyData: TCreateReviewBodyData) {
  try {
    const result = await reviewService.createReview(bodyData);
    return result;
  } catch (error: any) {
    return {
      error: error.message || "Failed to create review",
      data: null,
    };
  }
}

