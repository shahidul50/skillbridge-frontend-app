"use server"

import { contactSetvice } from "@/services/contact.service"
import { TContactMessageBody } from "@/types/contact.type"

export const sendContactMessageAction = async (body: TContactMessageBody) => {
    const result = await contactSetvice.sendContactMessage(body)
    return result
}