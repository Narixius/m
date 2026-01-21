import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const payments = sqliteTable(
  "payments",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    uuid: text()
      .notNull()
      .unique()
      .$default(() => crypto.randomUUID()),
    domain: text().notNull(),
    paymentStatus: text().notNull(),
    paymentId: text().notNull().unique(),
    paymentInfo: text().notNull(),
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
    index("index_paymentStatus").on(table.paymentStatus),
    index("index_paymentId").on(table.paymentId),
  ]
);

export const subscriptions = sqliteTable(
  "subscriptions",
  {
    uuid: text()
      .primaryKey()
      .unique()
      .$default(() => crypto.randomUUID()),
    domain: text().notNull(),
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
