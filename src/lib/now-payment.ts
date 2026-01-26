import { NOW_PAYMENT_API_KEY, NOW_PAYMENT_API_URL } from "astro:env/server";

import type { NowPaymentCreatePaymentResponse } from "@/types";

export const getCurrencies = () => {
  return fetch(new URL("/v1/full-currencies/", NOW_PAYMENT_API_URL), {
    headers: {
      "x-api-key": NOW_PAYMENT_API_KEY,
    },
  });
};

export const getPaymentStatus = (paymentId: string) => {
  return fetch(new URL(`/v1/payment/${paymentId}`, NOW_PAYMENT_API_URL), {
    headers: {
      "x-api-key": NOW_PAYMENT_API_KEY,
    },
  });
};

export const createPayment = async (
  price_amount: number,
  currency: string,
  orderId: string
) => {
  const createRes = await fetch(new URL("/v1/payment/", NOW_PAYMENT_API_URL), {
    method: "POST",
    body: JSON.stringify({
      price_amount,
      price_currency: "usd",
      pay_currency: currency,
      is_fee_paid_by_user: true,
      ipn_callback_url: new URL("/api/np-webhook", import.meta.env.APP_URL)
        .href,
      order_id: orderId,
    }),
    headers: {
      "x-api-key": NOW_PAYMENT_API_KEY,
      "content-type": "application/json",
    },
  });
  const res = (await createRes.json()) as NowPaymentCreatePaymentResponse;
  return res;
};
