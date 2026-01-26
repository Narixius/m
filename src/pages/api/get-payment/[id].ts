import type { APIRoute } from "astro";

import { createDB } from "db";
import { payments, subscriptions } from "db/schema";
import { eq, getTableColumns } from "drizzle-orm";

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

  return new Response(JSON.stringify(payment));
};
