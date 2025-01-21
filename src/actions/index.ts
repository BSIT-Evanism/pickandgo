import { feedback, user } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { ActionError, defineAction, type ActionAPIContext } from "astro:actions";
import { z } from "astro:schema";
import { auth } from "@/lib/auth";
import { admin } from "./admin";


export const server = {
    init: defineAction({
        accept: 'form',
        input: z.object({
            name: z.string().min(3),
            email: z.string().email(),
            password: z.string().min(8),
        }),
        handler: async (input, context) => {
            console.log(input);

            const noAdmin = await db.query.user.findFirst({
                where: (table, { eq }) => eq(table.role, 'admin')
            })

            if (noAdmin) {
                throw new ActionError({
                    code: 'CONFLICT',
                    message: 'Admin already exists'
                })
            }

            const data = await auth.api.signUpEmail({
                body: {
                    name: input.name,
                    email: input.email,
                    password: input.password,
                }
            })

            await db.update(user).set({
                role: 'admin'
            }).where(eq(user.id, data.user.id))

            return {
                success: true
            }
        }
    }),
    closePromotion: defineAction({
        handler: async (input, context) => {

            context.cookies.set('promotion-plat', 'closed', {
                maxAge: 60 * 5,
                path: '/',
                sameSite: 'lax',
            })

            context.locals.promotion = "closed";

            return {
                success: true
            }
        }
    }),
    submitFeedback: defineAction({
        accept: 'form',
        input: z.object({
            name: z.string().min(3),
            email: z.string().email(),
            message: z.string().min(10),
        }),
        handler: async (input, context) => {
            console.log(input);

            AdminMiddleware(context);

            await db.transaction(async (tx) => {

                const userData = await tx.query.user.findFirst({
                    where: (table, { eq }) => eq(table.id, context.locals.session?.userId as string)
                })

                if (!userData) {
                    throw new ActionError({
                        code: 'NOT_FOUND',
                        message: 'User not found'
                    })
                }

                if (userData.hasFeedback) {
                    throw new ActionError({
                        code: 'CONFLICT',
                        message: 'You have already submitted feedback'
                    })
                }

                await tx.insert(feedback).values({
                    userId: context.locals.session?.userId as string,
                    name: input.name,
                    email: input.email,
                    message: input.message,
                    createdAt: new Date(),
                })

                await tx.update(user).set({
                    hasFeedback: true
                }).where(eq(user.id, context.locals.session?.userId as string))

            })

            return {
                success: true
            }
        }
    }),
    admin
}

const AdminMiddleware = async (context: ActionAPIContext) => {

    if (!context.locals.session) {
        throw new ActionError({
            code: 'UNAUTHORIZED',
            message: 'You are not authorized to access this page'
        });
    }
}