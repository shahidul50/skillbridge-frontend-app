"use server";

import { tutorService } from "@/services/tutor.service";
import { GetTutorParams, IWeeklyAvailableSlot } from "@/types/tutors.type";
import { revalidatePath } from "next/cache";

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
