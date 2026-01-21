import { NOW_PAYMENT_API_KEY } from "astro:env/server";

import type { NowPaymentCreatePaymentResponse } from "@/types";

export const getCurrencies = () => {
  return fetch("https://api.nowpayments.io/v1/full-currencies/", {
    headers: {
      "x-api-key": NOW_PAYMENT_API_KEY,
    },
  });
};

export const createPayment = async (price_amount: number, currency: string) => {
  const createRes = await fetch("https://api.nowpayments.io/v1/payment/", {
    method: "POST",
    body: JSON.stringify({
      price_amount,
      price_currency: "usd",
      pay_currency: currency,
      // ipn_callback_url
    }),
    headers: {
      "x-api-key": NOW_PAYMENT_API_KEY,
      "content-type": "application/json",
    },
  });
  const res = (await createRes.json()) as NowPaymentCreatePaymentResponse;
  return res;
};
