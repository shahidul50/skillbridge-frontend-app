"use server";

import { profileService } from "@/services/profile.service";
import { revalidatePath } from "next/cache";

export const getUserProfileByIdAction = async () => {
    try {
        const response = await profileService.getUserProfileById();
        return response;
    } catch (error: any) {
        return {
            error: error?.message || "Something went wrong while fetching the profile",
            data: null,
        };
    }
};

export const updateUserProfileByIdAction = async (formData: FormData) => {
    try {
        const response = await profileService.updateUserProfileById(formData);

        if (!response.error) {
            revalidatePath("/dashboard/profile");
        }

        return response;
    } catch (error: any) {
        return {
            error: error?.message || "Something went wrong while updating the profile",
            data: null,
        };
    }
};
