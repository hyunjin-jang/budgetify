import { bigint, date, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { profiles } from "../settings/schema";

export const expenses = pgTable("expenses", {
  id: uuid().primaryKey().defaultRandom(),
  description: text().notNull(),
  amount: bigint({ mode: "number" }).notNull(),
  date: date().notNull(),
  category: uuid().references(() => expenseCategories.id, { onDelete: "set null" }),
  user_id: uuid().references(() => profiles.id, { onDelete: "cascade" }),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const expenseCategories = pgTable("expense_categories", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  user_id: uuid().references(() => profiles.id, { onDelete: "cascade" }),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});