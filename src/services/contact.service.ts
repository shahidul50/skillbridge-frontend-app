import { TContactMessageBody } from "@/types/contact.type";
import { env } from "@/env";

const API_URL = env.API_URL;

export const contactSetvice = {
    sendContactMessage: async (body: TContactMessageBody) => {
        try {
            const res = await fetch(`${API_URL}/contacts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const result = await res.json();
            if (!res.ok) {
                return { error: result.message || "Failed to send message", data: null }
            }
            return { error: null, data: result }
        } catch (err) {
            return { error: "An unexpected error occurred", data: null }
        }
    }
}