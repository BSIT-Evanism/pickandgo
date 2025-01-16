import { db } from "@/db";
import { posts, priority, sectionSequence } from "@/db/schema";
import { generateId } from "@/lib/utils";
import { ActionError, defineAction, type ActionAPIContext } from "astro:actions";
import { z } from "astro:schema";
import { eq } from "drizzle-orm";

export const admin = {
    createPost: defineAction({
        accept: 'json',
        input: z.object({
            title: z.string(),
            type: z.enum(['announcement', 'news']),
            shortDescription: z.string(),
        }),
        handler: async (input, context) => {

            if (!context.locals.user) {
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'You must be logged in to create a post'
                })
            }

            if (context.locals.user.role !== 'admin') {
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'You must be an admin to create a post'
                })
            }

            const [post] = await db.insert(posts).values({
                id: generateId(),
                title: input.title,
                type: input.type as 'announcement' | 'news',
                userId: context.locals.user.id,
                createdAt: new Date(),
                updatedAt: new Date(),
                shortDescription: input.shortDescription,
            }).returning()

            if (!post) {
                throw new ActionError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to create post'
                })
            }

            return {
                success: true,
                postId: post.id
            }

        }
    }),
    updatePostVisibility: defineAction({
        accept: 'json',
        input: z.object({
            postId: z.string(),
            public: z.boolean(),
        }),
        handler: async (input, context) => {
            if (!context.locals.user) {
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'You must be logged in to update post visibility'
                })
            }

            if (context.locals.user.role !== 'admin') {
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'You must be an admin to update post visibility'
                })
            }

            const [post] = await db.update(posts).set({
                public: input.public
            }).where(eq(posts.id, input.postId)).returning()

            if (!post) {
                throw new ActionError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to update post visibility'
                })
            }

            return {
                success: true,
                postId: post.id
            }
        }
    }),
    editPostContent: defineAction({
        accept: 'json',
        input: z.object({
            postId: z.string().regex(/^pst-\d{4}-\d{2}-\d{2}-[a-zA-Z0-9]{4}$/),
            content: z.array(z.any())
        }),
        handler: async (input, context) => {

            if (!context.locals.user) {
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'You must be logged in to edit post content'
                })
            }

            if (context.locals.user.role !== 'admin') {
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'You must be an admin to edit post content'
                })
            }

            const [post] = await db.update(posts).set({
                content: input.content,
                updatedAt: new Date()
            }).where(eq(posts.id, input.postId)).returning()

            if (!post) {
                throw new ActionError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to update post content'
                })
            }

            return {
                success: true,
                postId: post.id
            }
        }
    }),
    editGridLayout: defineAction({
        accept: 'json',
        input: z.object({
            layout: z.array(z.number())
        }),
        handler: async (input, context) => {
            if (!context.locals.user) {
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'You must be logged in to edit grid layout'
                })
            }

            if (context.locals.user.role !== 'admin') {
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'You must be an admin to edit grid layout'
                })
            }

            const [grid] = await db.update(sectionSequence).set({
                sequence: input.layout
            }).where(eq(sectionSequence.id, '1')).returning()

            if (!grid) {
                throw new ActionError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to update grid layout'
                })
            }

            return {
                success: true,
                gridId: grid.id
            }

        }
    }),
    deletePost: defineAction({
        accept: 'json',
        input: z.object({
            postId: z.string()
        }),
        handler: async (input, context) => {
            authMiddleware(context)

            const [prio] = await db.select().from(priority).where(eq(priority.postId, input.postId))

            if (prio) {
                throw new ActionError({
                    code: 'BAD_REQUEST',
                    message: 'Post is priority post'
                })
            }

            const [post] = await db.update(posts).set({
                deletedAt: new Date()
            }).where(eq(posts.id, input.postId)).returning()

            if (!post) {
                throw new ActionError({
                    code: 'NOT_FOUND',
                    message: 'Post not found'
                })
            }

            return {
                success: true,
                postId: post.id
            }
        }
    })
}


const authMiddleware = (context: ActionAPIContext) => {
    if (!context.locals.user) {
        throw new ActionError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to delete a post'
        })
    }

    if (context.locals.user.role !== 'admin') {
        throw new ActionError({
            code: 'UNAUTHORIZED',
            message: 'You must be an admin to delete a post'
        })
    }
}