import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const themeTable = sqliteTable("themes", {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  backdrop: text().notNull(),
  nav: text().notNull(),
  txt: text().notNull(),
  input: text().notNull(),
  card: text().notNull(),
  primary: text().notNull(),
  danger: text().notNull(),
});

export const configTable = sqliteTable("config", {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  key: text().notNull(),
  value: text().notNull()
});