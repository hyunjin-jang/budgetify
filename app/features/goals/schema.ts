import { bigint, date, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { profiles } from "../settings/schema";

export const goalStatus = pgEnum("goal_status", [
  "scheduled",   // 예정
  "in_progress", // 진행중
  "completed",   // 성공
  "failed",      // 실패
]);

export const goals = pgTable("goals", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  amount: bigint({ mode: "number" }).notNull(),
  start_date: date().notNull(),
  end_date: date().notNull(),
  status: goalStatus().notNull().default('scheduled'),
  user_id: uuid().references(() => profiles.id, { onDelete: "cascade" }),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});