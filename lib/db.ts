import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";



const expoDb = openDatabaseSync("books.db");
export const db = drizzle(expoDb); 