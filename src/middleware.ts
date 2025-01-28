import { auth } from "@/lib/auth";
import { defineMiddleware, sequence } from "astro:middleware";
import { checkDatabaseConnection, db } from "./db";


const authMiddleware = defineMiddleware(async (context, next) => {
    try {
        const isAuthed = await auth.api
            .getSession({
                headers: context.request.headers,
            })

        if (isAuthed) {
            context.locals.user = isAuthed.user;
            context.locals.session = isAuthed.session;
        } else {
            context.locals.user = null;
            context.locals.session = null;
        }

        return await next()
    } catch (error) {
        console.error(error);
        context.locals.user = null;
        context.locals.session = null;
        return await next()
    }
});

const initMiddleware = defineMiddleware(async (context, next) => {
    try {
        const noAdmin = await db.query.user.findFirst({
            where: (table, { eq }) => eq(table.role, 'admin')
        })
        console.log(noAdmin)
        context.locals.init = noAdmin ? true : false
        if (!noAdmin) {
            if (context.url.pathname !== '/init' && context.url.pathname !== '/_actions/init/') {
                return context.redirect('/init')
            }
        }

        return await next()
    } catch (error) {
        console.error(error)
        context.locals.init = false
        return await next()
    }
})


const checkDBMiddleware = defineMiddleware(async (context, next) => {
    const isConnected = await checkDatabaseConnection()
    if (!isConnected) {
        if (context.url.pathname !== '/error-db') {
            return context.redirect('/error-db')
        }
    }
    return await next()
})

export const onRequest = sequence(initMiddleware, authMiddleware)