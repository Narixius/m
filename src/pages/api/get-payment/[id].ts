import type { APIRoute } from "astro";

import { createDB } from "db";
import { payments } from "db/schema";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async (c) => {
  const db = createDB(c.locals.runtime.env.DB);
  const payment = await db
    .select()
    .from(payments)
    .where(eq(payments.uuid, c.params.id!))
    .get();

  if (!payment)
    new Response(JSON.stringify({ message: "payment not found" }), {
      status: 404,
    });

  return new Response(JSON.stringify(payment));
};
