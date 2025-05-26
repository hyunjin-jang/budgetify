import { pgEnum, pgSchema, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const users = pgSchema("auth").table("users", {
  id: uuid().primaryKey(),
})

export const roles = pgEnum("role", ["admin", "user"]);

export const profiles = pgTable("profiles", {
  id: uuid().primaryKey().references(() => users.id, { onDelete: "cascade" }),
  avatar: text(),
  name: text().notNull(),
  username: text().notNull().unique(),
  role: roles().notNull().default("user"),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});