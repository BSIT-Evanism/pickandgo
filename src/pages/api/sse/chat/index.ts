import { db, sqlClient } from "@/db";
import { chatMessage } from "@/db/schema";
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";


export const GET: APIRoute = async ({ request }) => {

    const stream = new ReadableStream({
        async start(controller) {

            controller.enqueue(`data: ${JSON.stringify({ type: "messages", data: "Hello" })}\n\n`);

            await sqlClient.listen('likes', message => {
                console.log(message)
                controller.enqueue(`data: ${JSON.stringify({ type: "messages", data: message })}\n\n`);
            })

        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    });
}