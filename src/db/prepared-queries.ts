import { db } from ".";
import { user } from "./schema";
import { eq } from "drizzle-orm";



export const getIfAdminExists = db.select({ id: user.id }).from(user).where(eq(user.role, "admin")).prepare("getIfAdminExists");