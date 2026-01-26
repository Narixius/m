import type { PaymentStatus } from "@/types";
import type { APIRoute } from "astro";

import { createDB } from "db";
import { payments, subscriptions } from "db/schema";
import { eq, getTableColumns } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async (c) => {
  const db = createDB(c.locals.runtime.env.DB);

  const payment = await db
    .select({
      ...getTableColumns(payments),
      subscription: subscriptions,
    })
    .from(payments)
    .leftJoin(subscriptions, eq(subscriptions.paymentId, payments.id))
    .where(eq(payments.uuid, c.params.id!))
    .get();

  if (!payment)
    new Response(JSON.stringify({ message: "payment not found" }), {
      status: 404,
    });




const paymentStatus = payment!.paymentInfo.payment_status as PaymentStatus;
const lastUpdate =
  payment!.paymentInfo.updates.length > 0
    ? payment!.paymentInfo.updates[payment!.paymentInfo.updates.length - 1]
    : null;

const parsedPayment = {
  invoiceId: payment!.uuid,
  paymentStatus,
  plan: payment!.planInfo,
  isTrial: payment!.isTrial,
  payCurrency: payment!.paymentInfo.pay_currency,
  payAmount: payment!.paymentInfo.pay_amount,
  payAddress: payment!.paymentInfo.pay_address,
  network: payment!.paymentInfo.network,
  paymentExpiry: payment!.paymentExpiry,
  subscription: {
    uuid: payment!.subscription?.uuid,
  },
  lastUpdate: {
    payment_status: lastUpdate?.payment_status,
  },
};

  return new Response(JSON.stringify(parsedPayment));
};
