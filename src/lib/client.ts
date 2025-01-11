import { treaty } from "@elysiajs/eden";
import type { App } from "@/pages/api/[...slugs]";


export const client = treaty<App>('http://localhost:4321')