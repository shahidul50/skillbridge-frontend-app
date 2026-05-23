"use server";

import { paymentService } from "@/services/payment.service";

export async function getPaymentAccountDetails() {
  const result = await paymentService.getPaymentAccountDetails();
  return result;
}
