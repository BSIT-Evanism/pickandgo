import type { Session, User } from "better-auth";
import { Elysia, t } from "elysia";
import { auth } from "../auth";
import { db } from "@/db";

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

export const listingRoutes = new Elysia({ prefix: '/listing' })
    .derive(({ request }) => userMiddleware(request))
    .get('/posts', async ({ user }) => {

        if (!user || user.role !== 'admin') {
            return {
                error: "Unauthorized"
            }
        }

        const posts = await db.query.posts.findMany({
            where: (table, { eq }) => eq(table.userId, user.id),
        })

        return {
            posts
        }

    }, {
        response: t.Union([
            t.Object({
                posts: t.Array(
                    t.Object({
                        id: t.String(),
                        createdAt: t.Date(),
                        updatedAt: t.Date(),
                        userId: t.String(),
                        title: t.String(),
                        content: t.Any(),
                        public: t.Boolean()
                    })
                )
            }),
            t.Object({
                error: t.String()
            })
        ])
    })