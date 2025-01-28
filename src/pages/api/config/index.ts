import { db } from "@/db";
import { getConfig } from "@/db/queries";
import { sectionSequence } from "@/db/schema";
import { eq } from "drizzle-orm";

export const GET = async () => {

    const config = await getConfig.execute();

    console.log(config);

    return new Response(JSON.stringify(config), {
        status: 200,
    });
};
