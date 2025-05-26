import { bigint, integer, pgEnum, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { profiles } from "../settings/schema";

export const budgetLevels = pgEnum("budget_level", [
  "basic",
  "intermediate",
  "advanced",
]);

export const settingMethods = pgEnum("setting_method", [
  "amount",
  "income_based",
]);

export const budgets = pgTable("budgets", {
  id: uuid().primaryKey(),
  setting_method: settingMethods().notNull(),
  level: budgetLevels().notNull(),
  total_amount: bigint({ mode: "number" }).notNull(),
  year: integer().notNull(),
  month: integer().notNull(),
  user_id: uuid().references(() => profiles.id, { onDelete: "cascade" }),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const budgetIncomes = pgTable("budget_incomes", {
  id: uuid().primaryKey(),
  budget_id: uuid().references(() => budgets.id, { onDelete: "cascade" }),
  title: text().notNull(),
  amount: bigint({ mode: "number" }).notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const budgetFixedExpenses = pgTable("budget_fixed_expenses", {
  id: uuid().primaryKey(),
  budget_id: uuid().references(() => budgets.id, { onDelete: "cascade" }),
  title: text().notNull(),
  amount: bigint({ mode: "number" }).notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const budgetAllocations = pgTable("budget_allocations", {
  id: uuid().primaryKey(),
  budget_id: uuid().references(() => budgets.id, { onDelete: "cascade" }),
  category: text().notNull(),
  amount: bigint({ mode: "number" }).notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});