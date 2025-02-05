import { drizzle } from "drizzle-orm/d1";
import * as schema from "./drizzle";
export const db = drizzle(process.env.db, { schema });
