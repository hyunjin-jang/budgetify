import { boolean, pgEnum, pgPolicy, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { profiles } from "../settings/schema";
import { authenticatedRole, authUid } from "drizzle-orm/supabase";
import { sql } from "drizzle-orm";

// 알림 타입(아이콘, 색상 등 프론트에서 매핑)
export const notificationType = pgEnum("notification_type", [
  "budget",    // 예산 관련
  "goal",      // 목표 관련
  "expense",   // 지출 관련
  "etc",       // 기타
]);

export const notifications = pgTable("notifications", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid().references(() => profiles.id, { onDelete: "cascade" }),
  type: notificationType().notNull(), // 알림 타입
  title: text().notNull(),
  description: text().notNull(),
  read: boolean().notNull().default(false),
  created_at: timestamp().notNull().defaultNow(),
}, (table) => [
  pgPolicy("notification-insert-policy", {
    for: "insert",
    to: authenticatedRole,
    as: "permissive",
    withCheck: sql`${authUid} = ${table.user_id}`,
  }),
  pgPolicy("notification-select-policy", {
    for: "select",
    to: authenticatedRole,
    as: "permissive",
    using: sql`${authUid} = ${table.user_id}`,
  }),
]);