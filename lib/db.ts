import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";



const expoDb = openDatabaseSync("books.db", {enableChangeListener: true, useNewConnection: true});
export const db = drizzle(expoDb); 