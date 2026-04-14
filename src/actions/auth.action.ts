"use server";

import { userService } from "@/services/user.service";


export async function getUserSession() {
    const session = await userService.getUserSession();
    return session;
}