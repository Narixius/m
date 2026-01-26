import type { APIRoute } from "astro";

import { NOW_PAYMENT_IPN_KEY } from "astro:env/server";
import { addDays } from "date-fns";
import { createDB } from "db";
import { payments, subscriptions } from "db/schema";
import { and, desc, eq, gte } from "drizzle-orm";
import crypto from "node:crypto";
import invariant from "tiny-invariant";

export const prerender = false;

const allowedIps = [
  "104.28.193.116", // delete it
  "51.89.194.21",
  "51.75.77.69",
  "138.201.172.58",
  "65.21.158.36",
];

function generateSignature(data: any, secret: string) {
  // const sortedData = sortObject(data);
  const dataString = JSON.stringify(data);
  return crypto.createHmac("sha512", secret).update(dataString).digest("hex");
}

function sortObject(obj: any): object {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sortObject(item));
  }

  return Object.keys(obj)
    .sort()
    .reduce((result: any, key) => {
      result[key] = sortObject(obj[key]);
      return result;
    }, {});
}

export const POST: APIRoute = async (c) => {
  const body = (await c.request.json()) as any;
  if (
    allowedIps.includes(c.request.headers.get("cf-connecting-ip") || "") &&
    generateSignature(body, NOW_PAYMENT_IPN_KEY) ===
      c.request.headers.get("x-nowpayments-sig")
  ) {
    const db = createDB(c.locals.runtime.env.DB);
    const payment = await db
      .select()
      .from(payments)
      .where(eq(payments.paymentId, String(body.payment_id)))
      .get();
    invariant(payment, "invalid payment");

    // update payment status
    if (["confirming", "confirmed", "sending"].includes(body.payment_status))
      body.payment_status = "processing";
    payment.paymentInfo.payment_status = body.payment_status;
    payment.paymentInfo.updates.push(body);

    await db.update(payments).set({ paymentInfo: payment.paymentInfo });

    if (payment.paymentInfo.payment_status === "finished") {
      // find the latest not-expired subscription
      const findLatestSubscription = await db
        .select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.domain, payment.domain),
            gte(subscriptions.expiresAt, new Date())
          )
        )
        .orderBy(desc(subscriptions.createdAt))
        .get();
      let expiresAt = addDays(new Date(), payment.planInfo.days);
      if (findLatestSubscription)
        expiresAt = addDays(
          findLatestSubscription.expiresAt,
          payment.planInfo.days
        );

      await db
        .insert(subscriptions)
        .values({
          domain: payment.domain,
          expiresAt,
          paymentId: payment.id,
        })
        .returning();
    }

    return new Response("ok", { status: 200 });
  }

  return new Response("Unauthorized", {
    status: 401,
    statusText: "unauthorized",
  });
};
