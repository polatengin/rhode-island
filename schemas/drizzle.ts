import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const organizations = sqliteTable("organizations", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  name: text(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`strftime('%s', 'now')`),
  updated_at: integer("created_at", { mode: "timestamp" }),
});

export const teams = sqliteTable("teams", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  organization_id: integer().notNull(),
  name: text(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`strftime('%s', 'now')`),
  updated_at: integer("created_at", { mode: "timestamp" }),
});

export const users = sqliteTable("users", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  organization_id: integer().notNull(),
  name: text(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`strftime('%s', 'now')`),
  updated_at: integer("created_at", { mode: "timestamp" }),
});

export const user_teams = sqliteTable("user_teams", {
  user_id: integer().notNull(),
  team_id: integer().notNull(),
  organization_id: integer().notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`strftime('%s', 'now')`),
  updated_at: integer("created_at", { mode: "timestamp" }),
});
