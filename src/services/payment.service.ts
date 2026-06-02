import { env } from "@/env";
import { ServiceOptions } from "@/types";
import {
  TPaymentAccount,
  TPaymentAccountParams,
  TPaymentAccountResponse,
  TPaymentParams,
  TPaymentResponse,
  TPaymentStatsResponse,
  TPaymentVerifyStatus,
  TCreatePaymentAccount,
  TUpdatePaymentAccount,
} from "@/types/admin.type";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const paymentService = {
  getPaymentAccountDetails: async () => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/payments/account-details`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const data = await res.json();
      return { error: null, data: data };
    } catch (err) {
      console.log(err);
      return { error: "Some error occurred", data: null };
    }
  },

  getAllPaymentsForAdminDashboard: async (
    params?: TPaymentParams,
    options?: ServiceOptions
  ) => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/payments/admin`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, value.toString());
          }
        });
      }

      const config: RequestInit = {
        headers: {
          Cookie: cookieStore.toString(),
        },
      };

      if (options?.cache) {
        config.cache = options.cache;
      } else {
        config.cache = "no-store";
      }

      const res = await fetch(url.toString(), config);
      const result = await res.json();

      if (!res.ok) {
        return {
          error: result?.message || "Failed to fetch payments",
          data: null,
        };
      }

      return { error: null, data: result?.data as TPaymentResponse };
    } catch (err) {
      console.error(err);
      return {
        error: "Some error occurred while fetching payments",
        data: null,
      };
    }
  },

  getPaymentStatsForAdminDashboard: async () => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/payments/admin/stats`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const result = await res.json();

      if (!res.ok) {
        return {
          error: result?.message || "Failed to fetch payment stats",
          data: null,
        };
      }

      return { error: null, data: result?.data as TPaymentStatsResponse };
    } catch (err) {
      console.error(err);
      return {
        error: "Some error occurred while fetching payment stats",
        data: null,
      };
    }
  },

  verifyPaymentTransactionForAdminDashboard: async (
    id: string,
    data: { status: TPaymentVerifyStatus }
  ) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/payments/admin/verify/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        return {
          error: result?.message || "Failed to verify payment",
          data: null,
        };
      }

      return { error: null, data: result?.data || result };
    } catch (err) {
      console.error(err);
      return {
        error: "Some error occurred while verifying payment",
        data: null,
      };
    }
  },

  getAllPaymentAccountForAdminDashboard: async (
    params?: TPaymentAccountParams,
    options?: ServiceOptions
  ) => {
    try {
      const cookieStore = await cookies();
      const url = new URL(`${API_URL}/payments/admin/accounts`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, value.toString());
          }
        });
      }

      const config: RequestInit = {
        headers: {
          Cookie: cookieStore.toString(),
        },
      };

      if (options?.cache) {
        config.cache = options.cache;
      } else {
        config.cache = "no-store";
      }

      const res = await fetch(url.toString(), config);
      const result = await res.json();

      if (!res.ok) {
        return {
          error: result?.message || "Failed to fetch payment accounts",
          data: null,
        };
      }

      return {
        error: null,
        data: result?.data as TPaymentAccountResponse,
      };
    } catch (err) {
      console.error(err);
      return {
        error: "Some error occurred while fetching payment accounts",
        data: null,
      };
    }
  },

  getPaymentAccountDetailsByIdForAdminDashboard: async (id: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/payments/admin/${id}`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      const result = await res.json();

      if (!res.ok) {
        return {
          error: result?.message || "Failed to fetch payment account details",
          data: null,
        };
      }

      return {
        error: null,
        data: result?.data as TPaymentAccount,
      };
    } catch (err) {
      console.error(err);
      return {
        error: "Some error occurred while fetching payment account details",
        data: null,
      };
    }
  },

  createPaymentAccountForAdminDashboard: async (
    data: TCreatePaymentAccount
  ) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/payments/admin/account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        return {
          error: result?.message || "Failed to create payment account",
          data: null,
        };
      }

      return {
        error: null,
        data: result?.data as TPaymentAccount,
      };
    } catch (err) {
      console.error(err);
      return {
        error: "Some error occurred while creating payment account",
        data: null,
      };
    }
  },

  updatePaymentAccountForAdminDashboard: async (
    id: string,
    data: TUpdatePaymentAccount
  ) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/payments/admin/account/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        return {
          error: result?.message || "Failed to update payment account",
          data: null,
        };
      }

      return {
        error: null,
        data: result?.data as TPaymentAccount,
      };
    } catch (err) {
      console.error(err);
      return {
        error: "Some error occurred while updating payment account",
        data: null,
      };
    }
  },
};
