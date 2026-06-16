import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import {configTable, themeTable} from "@/db/schema";
import {db} from "@/db";
import migrations from '@/db/drizzle/migrations';
import {eq} from "drizzle-orm";
import {defaultTheme} from "@/constants/themes";

export type Theme = typeof themeTable.$inferSelect;

export function transformTheme(theme: Theme): Record<string, string | number> {
  const result: Record<string, string | number> = {};

  result["--color-backdrop"] = theme.backdrop;
  result["--color-nav"] = theme.nav;
  result["--color-txt"] = theme.txt;
  result["--color-input"] = theme.input;
  result["--color-card"] = theme.card;
  result["--color-primary"] = theme.primary;
  result["--color-danger"] = theme.danger;
  
  return result;
}

export async function getThemes(): Promise<Theme[]> {
  return db.select().from(themeTable);
}

export async function updateTheme(theme: Theme) {
  const result = await db.update(themeTable).set(theme).where(eq(themeTable.name, theme.name));
  return result.changes > 0;
}

export async function getTheme(name: string): Promise<Theme | null> {
  const result = await db.select().from(themeTable).where(eq(themeTable.name, name)).limit(1);
  
  if (result.length > 0) {
    return result[0];
  }
  
  return null;
}

export async function getCurrentTheme(): Promise<Theme | null> {
  const themeName = await db.select()
    .from(configTable).where(eq(configTable.key, "current-theme"));
  
  if (themeName.length === 0) {
    return null;
  }
  
  return getTheme(themeName[0].value);
}

export async function tryInit(): Promise<boolean> {
  await migrate(db, migrations);
  
  let existingDefault = await getTheme("default");
  
  if (existingDefault === null) {
    const inserted = await db.insert(themeTable).values(defaultTheme) !== null;
    if (!inserted) {
      return false;
    }
  }
  
  const currentTheme = await db.select()
    .from(configTable).where(eq(configTable.key, "current-theme"));
  
  if (currentTheme.length > 0) {
    return true;
  }
  
  const newCurrent = await db.insert(configTable).values({key: "current-theme", value: "default"});
  return newCurrent.changes > 0;
}