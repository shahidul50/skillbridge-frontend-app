"use server";

import { tutorService } from "@/services/tutor.service";
import { GetTutorParams, IWeeklyAvailableSlot, TDashboardRevenueTrendParams, TBookingHistoryParams, TUpdateMeetingLinkOrStatusBodyData, TScheduleEventsQueryParams } from "@/types";
import { revalidatePath, revalidateTag } from "next/cache";

export async function getAllTutor(params?: GetTutorParams) {
    const tutors = await tutorService.getAllTutor(params, { cache: "no-store" });
    return tutors;
}

export async function updateTutorAction(formData: FormData) {
    const res = await tutorService.updateTutor(formData);
    if (!res.error) {
        revalidatePath("/tutor-dashboard/profile");
    }
    return res;
}

export async function getTutorDetailsByUserId() {
    const res = await tutorService.getTutorDetailsByUserId();
    return res;
}

export async function getTutorProfileByProfileId(profileId: string) {
    const res = await tutorService.getTutorProfileByProfileId(profileId);
    return res;
}

export async function getAvailableSlots(tutorProfileId: string, startDate: string) {
    const res = await tutorService.getAvailableSlots(tutorProfileId, startDate);
    return res;
}

export async function getTutorSelectedCategories() {
    const res = await tutorService.getTutorSelectedCategories();
    return res;
}

export async function setTutorCategoriesAction(categoryIds: string[]) {
    const res = await tutorService.setTutorCategories(categoryIds);
    if (!res.error) {
        revalidatePath("/tutor-dashboard/my-subject");
    }
    return res;
}

export async function getWeeklyAvailableSlots() {
    const res = await tutorService.getWeeklyAvailableSlots();
    return res;
}

export async function createWeeklyAvailableSlot(data: IWeeklyAvailableSlot) {
    const res = await tutorService.createWeeklyAvailableSlot(data);
    if (!res.error) {
        revalidatePath("/tutor-dashboard/availability");
    }
    return res;
}

export async function deleteWeeklyAvailableSlot(slotId: string) {
    const res = await tutorService.deleteWeeklyAvailableSlot(slotId);
    if (!res.error) {
        revalidatePath("/tutor-dashboard/availability");
    }
    return res;
}

export async function updateWeeklyAvailableSlot(slotId: string, data: { isActive: boolean }) {
    const res = await tutorService.updateWeeklyAvailableSlot(slotId, data);
    if (!res.error) {
        revalidatePath("/tutor-dashboard/availability");
    }
    return res;
}

export async function createTutorException(data: { date: string; reason: string }) {
    const res = await tutorService.createTutorException(data);
    if (!res.error) {
        revalidatePath("/tutor-dashboard/exceptions");
    }
    return res;
}

export async function getAllTutorException() {
    const res = await tutorService.getAllTutorException();
    return res;
}

export async function deleteTutorException(id: string) {
    const res = await tutorService.deleteTutorException(id);
    if (!res.error) {
        revalidatePath("/tutor-dashboard/exceptions");
    }
    return res;
}

export async function getDashboardMetaAction() {
    const res = await tutorService.getDashboardMeta({ cache: "no-store" });
    return res;
}

export async function getDashboardRevenueTrendsAction(params: TDashboardRevenueTrendParams) {
    const res = await tutorService.getDashboardRevenueTrends(params, { cache: "no-store" });
    return res;
}

export async function getTutorAllSessionAction(params: TBookingHistoryParams) {
    const res = await tutorService.getTutorAllSession(params, { cache: "no-store" });
    return res;
}

export async function updateBookingStatusAction(bookingId: string, data: TUpdateMeetingLinkOrStatusBodyData) {
    const res = await tutorService.updateBookingStatus(bookingId, data);
    if (!res.error) {
        revalidatePath("/tutor-dashboard/booking-history");
        revalidateTag("tutor-sessions", "max");
        revalidateTag("tutor-dashboard-meta", "max");
    }
    return res;
}

export async function getSessionDetailsByBookingIdAction(bookingId: string) {
    const res = await tutorService.getSessionDetailsByBookingId(bookingId);
    return res;
}

export async function getTutorScheduleMetaAction() {
    const res = await tutorService.getTutorScheduleMeta({ cache: "no-store" });
    return res;
}

export async function getTutorScheduleEventsAction(params: TScheduleEventsQueryParams) {
    const res = await tutorService.getTutorScheduleEvents(params, { cache: "no-store" });
    return res;
}



