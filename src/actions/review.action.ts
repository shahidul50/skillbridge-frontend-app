"use server";

import { reviewService } from "@/services/review.service";
import { TCreateReviewBodyData, TGetAllBookingWithReviewQueryParams, TGetAllReviewByTutorProfileIdQueryParams } from "@/types/review.type";
import { revalidateTag } from "next/cache";

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
    if (result && !result.error) {
      revalidateTag("tutor-profile-details", "max");
      revalidateTag("tutors", "max");
    }
    return result;
  } catch (error: any) {
    return {
      error: error.message || "Failed to create review",
      data: null,
    };
  }
}

export async function getAllReviewStatsByTutorProfileIdAction(tutorProfileId: string) {
  try {
    const result = await reviewService.getAllReviewStatsByTutorProfileId(tutorProfileId);
    return result;
  } catch (error: any) {
    return {
      error: error.message || "Failed to fetch review stats",
      data: null,
    };
  }
}

export async function getAllReviewByTutorProfileIdAction(tutorProfileId: string, params: TGetAllReviewByTutorProfileIdQueryParams) {
  try {
    const result = await reviewService.getAllReviewByTutorProfileId(tutorProfileId, params);
    return result;
  } catch (error: any) {
    return {
      error: error.message || "Failed to fetch reviews",
      data: null,
    };
  }
}
