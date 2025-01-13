// pages/[...slugs].ts
import { auth } from '@/lib/auth';
import { Elysia, t, type Context } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { authRoutes } from '@/lib/backend/auth-routes';
import { listingRoutes } from '@/lib/backend/listing-routes';



const app = new Elysia({ prefix: '/api' })
    .use(authRoutes)
    .use(listingRoutes)

const handle = ({ request }: { request: Request }) => app.handle(request)

export const GET = handle
export const POST = handle

export type App = typeof app