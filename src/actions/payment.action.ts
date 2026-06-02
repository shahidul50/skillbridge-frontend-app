"use server";

import {
  TPaymentAccountParams,
  TPaymentParams,
  TPaymentVerifyStatus,
  TCreatePaymentAccount,
  TUpdatePaymentAccount,
} from "@/types/admin.type";
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

export async function verifyPaymentTransactionForAdminDashboardAction(
  id: string,
  data: { status: TPaymentVerifyStatus }
) {
  const result = await paymentService.verifyPaymentTransactionForAdminDashboard(
    id,
    data
  );
  return result;
}

export async function getAllPaymentAccountForAdminDashboardAction(
  params?: TPaymentAccountParams
) {
  const result = await paymentService.getAllPaymentAccountForAdminDashboard(
    params
  );
  return result;
}

export async function getPaymentAccountDetailsByIdForAdminDashboardAction(id: string) {
  const result = await paymentService.getPaymentAccountDetailsByIdForAdminDashboard(id);
  return result;
}

export async function createPaymentAccountForAdminDashboardAction(data: TCreatePaymentAccount) {
  const result = await paymentService.createPaymentAccountForAdminDashboard(data);
  return result;
}

export async function updatePaymentAccountForAdminDashboardAction(
  id: string,
  data: TUpdatePaymentAccount
) {
  const result = await paymentService.updatePaymentAccountForAdminDashboard(
    id,
    data
  );
  return result;
}
