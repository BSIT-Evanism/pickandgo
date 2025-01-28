import { db } from ".";
import { sectionSequence } from "./schema";
import { eq } from "drizzle-orm";



export const getConfig = db.query.sectionSequence.findFirst({
    where: eq(sectionSequence.id, "1"),
}).prepare('getConfig')


export const getRecentPosts = db.query.posts.findMany({
    where: (table, { eq, and, isNull }) => and(eq(table.public, true), isNull(table.deletedAt)),
    orderBy: (table, { desc }) => desc(table.createdAt),
    limit: 3,
}).prepare('getRecentPosts')

export const getPriorityPosts = db.query.priority.findMany({
    orderBy: (table, { desc }) => desc(table.priority),
    with: {
        post: true
    },
    limit: 3,
}).prepare('getPriorityPosts')