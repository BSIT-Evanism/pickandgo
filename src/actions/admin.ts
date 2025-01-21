import { db } from "@/db";
import { events, farmActivity, feedback, promotions, user } from "@/db/schema";
import { ActionError, defineAction, type ActionAPIContext } from "astro:actions";
import { z } from "astro:schema";
import { count, eq } from "drizzle-orm";
import { wait } from "@/lib/utils";


export const admin = {
    addFarmActivity: defineAction({
        accept: 'json',
        input: z.object({
            title: z.string(),
        }),
        handler: async (input, context) => {

            AdminMiddleware(context)

            const [activity] = await db.insert(farmActivity).values({
                name: input.title,
                description: [],
                createdAt: new Date(),
                updatedAt: new Date()
            }).returning()

            return {
                success: true,
                activity
            }
        }
    }),
    updateFarmActivity: defineAction({
        accept: 'json',
        input: z.object({
            id: z.string(),
            description: z.array(z.object({
                id: z.string(),
                type: z.enum(['heading', 'paragraph', 'list', 'image', 'link']),
                content: z.string(),
            })),
        }),
        handler: async (input, context) => {
            AdminMiddleware(context)

            const [activity] = await db.update(farmActivity).set({
                description: input.description,
                updatedAt: new Date()
            }).where(eq(farmActivity.id, input.id)).returning()

            return {
                success: true,
                activity
            }
        }
    }),
    editFarmActivity: defineAction({
        accept: 'json',
        input: z.object({
            id: z.string(),
            name: z.string(),
            image: z.string().regex(/^https?:\/\//),
            active: z.boolean(),
        }),
        handler: async (input, context) => {
            AdminMiddleware(context)
            await wait(1000)
            try {


                if (input.active) {
                    const [data] = await db.select({ count: count() }).from(farmActivity).where(eq(farmActivity.active, true))
                    console.log(data)
                    if (data.count >= 3) {
                        throw new ActionError({
                            code: 'BAD_REQUEST',
                            message: 'You can only have 3 active activities'
                        });
                    }
                }

                const [activity] = await db.update(farmActivity).set({
                    name: input.name,
                    image: input.image,
                    active: input.active,
                    updatedAt: new Date()
                }).where(eq(farmActivity.id, input.id)).returning()

                return {
                    success: true,
                    activity
                }

            } catch (error) {
                console.error(error)
                throw new ActionError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to update activity'
                });
            }
        }
    }),
    addEvent: defineAction({
        accept: 'json',
        input: z.object({
            title: z.string(),
            description: z.string(),
            startDate: z.string().datetime(),
            endDate: z.string().datetime(),
        }),
        handler: async (input, context) => {

            AdminMiddleware(context)

            const [event] = await db.insert(events).values({
                name: input.title,
                description: input.description,
                startDate: new Date(input.startDate),
                endDate: new Date(input.endDate),
                createdAt: new Date(),
                updatedAt: new Date()
            }).returning()

            return {
                success: true,
                event
            }
        }
    }),
    addPromotion: defineAction({
        accept: 'json',
        input: z.object({
            title: z.string(),
            description: z.string(),
            tier: z.enum(['bronze', 'silver', 'gold']),
        }),
        handler: async (input, context) => {
            AdminMiddleware(context)

            const [promotion] = await db.insert(promotions).values({
                name: input.title,
                description: input.description,
                tier: input.tier,
                createdAt: new Date(),
                updatedAt: new Date()
            }).returning()

            return {
                success: true,
                promotion
            }
        }
    }),
    resetFeedback: defineAction({
        accept: 'json',
        handler: async (input, context) => {

            AdminMiddleware(context)

            await db.update(user).set({
                hasFeedback: false
            })

            return {
                success: true
            }
        }
    })
}

const AdminMiddleware = async (context: ActionAPIContext) => {

    if (!context.locals.session) {
        throw new ActionError({
            code: 'UNAUTHORIZED',
            message: 'You are not authorized to access this page'
        });
    }

    if (context.locals.user?.role !== 'admin') {
        throw new ActionError({
            code: 'UNAUTHORIZED',
            message: 'You are not authorized to access this page'
        });
    }
}