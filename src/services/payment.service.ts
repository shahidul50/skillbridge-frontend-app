import { env } from "@/env";
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
};
