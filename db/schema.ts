import { relations } from "drizzle-orm";
import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

import type { plans } from "@/plans";
import type { NowPaymentCreatePaymentResponse } from "@/types";

export const payments = sqliteTable(
  "payments",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    uuid: text()
      .notNull()
      .unique()
      .$default(() => crypto.randomUUID()),
    domain: text().notNull(),
    paymentId: text().notNull().unique(),
    paymentInfo: text({ mode: "json" })
      .$type<
        NowPaymentCreatePaymentResponse & {
          updates: any[];
        }
      >()
      .notNull(),
    planInfo: text({ mode: "json" }).$type<(typeof plans)[number]>().notNull(),
    isTrial: integer({ mode: "boolean" }).notNull(),
    paymentExpiry: integer({ mode: "timestamp" }).notNull(),
    expiresAt: integer({ mode: "timestamp" }).notNull(),
    createdAt: integer({ mode: "timestamp" })
      .notNull()
      .$default(() => new Date()),
    updatedAt: integer({ mode: "timestamp" })
      .notNull()
      .$default(() => new Date()),
  },
  (table) => [
    index("index_domain").on(table.domain),
    index("index_paymentId").on(table.paymentId),
  ]
);

export const paymentsRelations = relations(payments, ({ one }) => ({
  subscription: one(subscriptions),
}));

export const subscriptions = sqliteTable(
  "subscriptions",
  {
    uuid: text()
      .primaryKey()
      .unique()
      .$default(() => crypto.randomUUID()),
    domain: text().notNull(),
    paymentId: integer()
      .notNull()
      .references(() => payments.id),
    expiresAt: integer({ mode: "timestamp" }).notNull(),
    createdAt: integer({ mode: "timestamp" })
      .notNull()
      .$default(() => new Date()),
    updatedAt: integer({ mode: "timestamp" })
      .notNull()
      .$default(() => new Date()),
  },
  (table) => [index("name").on(table.domain)]
);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  payment: one(payments),
}));
