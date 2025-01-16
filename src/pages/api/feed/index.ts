import { db } from "@/db";


export const GET = async () => {
    const [recent, priority] = await Promise.all([
        db.query.posts.findMany({
            where: (table, { eq, and, isNotNull }) => and(eq(table.public, true), isNotNull(table.deletedAt)),
            orderBy: (table, { desc }) => desc(table.createdAt),
            limit: 1,
            columns: {
                content: false
            }
        }),
        db.query.priority.findMany({
            orderBy: (table, { desc }) => desc(table.priority),
            with: {
                post: {
                    columns: {
                        content: false
                    }
                }
            },
            limit: 1,
        })
    ]);

    if (!recent) {
        return new Response(JSON.stringify({
            error: "No feed found"
        }));
    }

    return new Response(JSON.stringify({ recent: recent ? recent : {}, priority: priority ? priority : {} }));
};
