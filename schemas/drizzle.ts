import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const organizations = sqliteTable("organizations", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});

export const teams = sqliteTable("teams", {
  id: integer().primaryKey({ autoIncrement: true }),
  organization_id: integer().notNull(),
  name: text().notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});

export const users = sqliteTable("users", {
  id: integer().primaryKey({ autoIncrement: true }),
  organization_id: integer().notNull(),
  name: text().notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});

export const user_teams = sqliteTable("user_teams", {
  user_id: integer().notNull(),
  team_id: integer().notNull(),
  organization_id: integer().notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});
