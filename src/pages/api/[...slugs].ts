// pages/[...slugs].ts
import { Elysia, t } from 'elysia'

const app = new Elysia({ prefix: '/api' })
    .get('/', () => 'hi')
    .get('/hello', () => 'hello')

const handle = ({ request }: { request: Request }) => app.handle(request) 

export const GET = handle 
export const POST = handle 