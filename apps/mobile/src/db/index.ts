import {openDatabaseSync} from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import {DB_NAME} from "@/constants/db";

const expoDb = openDatabaseSync(DB_NAME);
export const db = drizzle(expoDb);
