import { env } from "@/env";
import { cookies } from "next/headers";

const AUTH_URL = env.AUTH_URL;

export const userService = {
    getUserSession: async () => {
        try {
            const cookieStore = await cookies()

            const res = await fetch(`${AUTH_URL}/get-session`, {
                headers: {
                    Cookie: cookieStore.toString()
                },
                cache: "no-store"
            },);
            const session = await res.json();
            return { error: null, data: session }
        } catch (err) {
            console.log(err)
            return { error: "Some error occurred", data: null }
        }
    }
}