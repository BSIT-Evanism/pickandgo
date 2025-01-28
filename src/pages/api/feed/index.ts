import { db } from "@/db";
import { getPriorityPosts, getRecentPosts } from "@/db/queries";


export const GET = async () => {
    const [recent, priority] = await Promise.all([
        getRecentPosts.execute(),
        getPriorityPosts.execute()
    ]);

    if (!recent) {
        return new Response(JSON.stringify({
            error: "No feed found"
        }));
    }

    return new Response(JSON.stringify({ recent: recent ? recent : {}, priority: priority ? priority : {} }));
};
