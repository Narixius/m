import type { APIRoute } from "astro";

import { z } from "astro/zod";
import { addDays } from "date-fns";
import { createDB } from "db";
import { payments, subscriptions } from "db/schema";
import { and, eq } from "drizzle-orm";

import type {
  NowPaymentCreatePaymentResponse,
  NowPaymentCurrency,
} from "@/types";

import { createPayment, getCurrencies } from "@/lib/now-payment";
import { plans } from "@/plans";

export const prerender = false;
const schema = z
  .object({
    plan: z.enum(plans.map((p) => p.id) as [string, ...string[]], {
      message: "Please select one of the plans",
    }),
    domain: z.string().min(1, "Domain is required"),
    currency: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.plan !== "trial" && !data.currency) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a currency",
        path: ["currency"],
      });
    }
  });

class RuntimeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RuntimeError";
  }
}

export const POST: APIRoute = async (c) => {
  const body = await c.request.json();
  const data = schema.parse(body);
  const selectedPlan = plans.find((p) => p.id === data.plan)!;
  const db = createDB(c.locals.runtime.env.DB);
  let payment;
  const uuid = crypto.randomUUID();
  try {
    if (data.plan === "trial") {
      const alreadyTrial = !!(await db
        .select()
        .from(payments)
        .where(
          and(eq(payments.domain, data.domain), eq(payments.isTrial, true))
        )
        .get());
      if (alreadyTrial) {
        throw new RuntimeError("Trial has already been used for this domain");
      }
      payment = {
        payment_id: `trial-${uuid}`,
        payment_status: "finished",
        expiration_estimate_date: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
      };
    } else {
      const availableCurrencies = (await (await getCurrencies()).json()) as {
        currencies: NowPaymentCurrency[];
      };
      if (
        !availableCurrencies.currencies.find((c) => c.code === data.currency)
      ) {
        throw new Error("Selected network is not valid");
      }
      payment = await createPayment(selectedPlan.cost, data.currency!, uuid);
    }
    const record = await db
      .insert(payments)
      .values({
        uuid,
        domain: data.domain,
        paymentId: payment.payment_id,
        paymentInfo: {
          ...(payment as NowPaymentCreatePaymentResponse),
          updates: [],
        },
        paymentExpiry: new Date(payment.expiration_estimate_date),
        expiresAt: addDays(new Date(), selectedPlan.days),
        planInfo: selectedPlan,
        isTrial: data.plan === "trial",
      })
      .returning();

    if (data.plan === "trial") {
      await db.insert(subscriptions).values({
        domain: data.domain,
        expiresAt: addDays(new Date(), selectedPlan.days),
        paymentId: record[0].id,
      });
    }

    return new Response(
      JSON.stringify({
        id: record[0].uuid,
      }),
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
  } catch (e) {
    if (e instanceof RuntimeError) {
      return new Response(
        JSON.stringify({
          message: e.message,
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json",
          },
        }
      );
    }
    console.error(e);
    return new Response(
      JSON.stringify({
        message: "Something went wrong, please try again later.",
      }),
      {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }
};
