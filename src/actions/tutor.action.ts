"use server";

import { tutorService } from "@/services/tutor.service";
import { GetTutorParams } from "@/types/tutors.type";

export async function getAllTutor(params?: GetTutorParams) {
    const tutors = await tutorService.getAllTutor(params, { cache: "no-store" });
    return tutors;
}
