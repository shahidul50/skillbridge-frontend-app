"use server";

import { tutorService } from "@/services/tutor.service";
import { GetTutorParams } from "@/types/tutors.type";
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
