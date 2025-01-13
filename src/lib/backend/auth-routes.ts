import { Elysia, t, type Context } from "elysia"
import { auth } from "../auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { User, Session } from "better-auth";

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

const userMiddleware = async (request: Request) => {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
        return {
            user: null,
            session: null
        }
    }

    return {
        user: session.user,
        session: session.session
    }
}

const userInfo = (user: User & { role: string } | null, session: Session | null) => {
    return {
        user: user,
        session: session
    }
}

const authRoutes = new Elysia()
    .derive(({ request }) => userMiddleware(request))
    .all("/auth/*", betterAuthView)
    .get("/init", async () => {
        const noAdmin = await db.query.user.findFirst({
            where: (table, { eq }) => eq(table.role, 'admin')
        })
        return noAdmin ? {
            success: true,
            message: "Admin user already exists"
        } : {
            success: false,
            message: "No admin user found"
        }
    })
    .post("/init", async ({ request, body }) => {
        const { name, email, password } = body

        console.log(request)

        try {
            await auth.api.signUpEmail({
                body: {
                    email: email,
                    name: name,
                    password: password,
                    role: 'admin'
                }
            })

            await db.update(user).set({
                role: 'admin'
            }).where(eq(user.email, email))

            return {
                success: true,
                message: "Admin user created"
            }
        } catch (error) {
            console.error(error)
            return {
                success: false,
                message: "Failed to create admin user"
            }
        }
    }, {
        body: t.Object({
            name: t.String(),
            email: t.String({
                format: 'email'
            }),
            password: t.String()
        }),
        beforeHandle: ({ request }) => {
            console.log(request)
        }
    })


export { authRoutes }