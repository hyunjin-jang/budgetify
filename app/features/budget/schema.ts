import { bigint, integer, numeric, pgEnum, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
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
  id: uuid().primaryKey().defaultRandom(),
  setting_method: settingMethods().notNull(),
  // level: budgetLevels().notNull(),
  total_amount: bigint({ mode: "number" }).notNull(),
  user_id: uuid().references(() => profiles.id, { onDelete: "cascade" }),
  date: timestamp().notNull().defaultNow(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const budgetIncomes = pgTable("budget_incomes", {
  id: uuid().primaryKey().defaultRandom(),
  budget_id: uuid().references(() => budgets.id, { onDelete: "cascade" }),
  title: text().notNull(),
  amount: bigint({ mode: "number" }).notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const budgetFixedExpenses = pgTable("budget_fixed_expenses", {
  id: uuid().primaryKey().defaultRandom(),
  budget_id: uuid().references(() => budgets.id, { onDelete: "cascade" }),
  title: text().notNull(),
  amount: bigint({ mode: "number" }).notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const budgetRecommendations = pgTable("budget_recommendations", {
  id: uuid().primaryKey().defaultRandom(),
  budget_id: uuid().references(() => budgets.id, { onDelete: "cascade" }),
  title: text().notNull(),
  description: text().notNull(),
  savings: bigint({ mode: "number" }).notNull(),
  saving_ratio: numeric("saving_ratio", { precision: 5, scale: 2 }).notNull(),
  user_id: uuid().references(() => profiles.id, { onDelete: "cascade" }).unique(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const budgetAllocations = pgTable("budget_allocations", {
  id: uuid().primaryKey().defaultRandom(),
  recommendation_id: uuid().references(() => budgetRecommendations.id, { onDelete: "cascade" }),
  category: text().notNull(),
  amount: bigint({ mode: "number" }).notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});