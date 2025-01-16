import { db } from "@/db";
import { sectionSequence } from "@/db/schema";
import { eq } from "drizzle-orm";

export const GET = async () => {

    const config = await db.query.sectionSequence.findFirst({
        where: eq(sectionSequence.id, "1"),
    });

    console.log(config);

    return new Response(JSON.stringify(config), {
        status: 200,
    });
};
