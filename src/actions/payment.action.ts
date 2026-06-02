"use server";

import { TPaymentParams, TPaymentVerifyStatus } from "@/types/admin.type";
import { paymentService } from "@/services/payment.service";

export async function getPaymentAccountDetails() {
  const result = await paymentService.getPaymentAccountDetails();
  return result;
}

export async function getAllPaymentsForAdminDashboardAction(params?: TPaymentParams) {
  const result = await paymentService.getAllPaymentsForAdminDashboard(params);
  return result;
}

export async function getPaymentStatsForAdminDashboardAction() {
  const result = await paymentService.getPaymentStatsForAdminDashboard();
  return result;
}

export async function verifyPaymentTransactionForAdminDashboardAction(id: string, data: { status: TPaymentVerifyStatus }) {
  const result = await paymentService.verifyPaymentTransactionForAdminDashboard(id, data);
  return result;
}
