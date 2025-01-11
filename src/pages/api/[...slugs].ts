// pages/[...slugs].ts
import { auth } from '@/lib/auth';
import { Elysia, t, type Context } from 'elysia'

const betterAuthView = (context: Context) => {
    const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"]
    // validate request method
    if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
        return auth.handler(context.request);
    }
    else {
        context.error(405)
    }
}

const app = new Elysia({ prefix: '/api' })
    .get('/', () => 'hi')
    .get('/hello', () => 'hello')
    .all("/auth/*", betterAuthView)

const handle = ({ request }: { request: Request }) => app.handle(request)

export const GET = handle
export const POST = handle

export type App = typeof app