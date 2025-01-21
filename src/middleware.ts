import { auth } from "@/lib/auth";
import { defineMiddleware, sequence } from "astro:middleware";
import { getIfAdminExists } from "./db/prepared-queries";

const authMiddleware = defineMiddleware(async (context, next) => {
    try {
        const isAuthed = await auth.api
            .getSession({
                headers: context.request.headers,
            })
        if (isAuthed) {
            context.locals.user = {
                ...isAuthed.user,
                role: isAuthed.user.role || 'user'
            };
            context.locals.session = isAuthed.session;
        } else {
            context.locals.user = null;
            context.locals.session = null;
        }

        return await next();
    } catch (error) {
        console.error(error);
        return await next();
    }
});

export const initMiddleware = defineMiddleware(async (context, next) => {

    const [adminExists] = await getIfAdminExists.execute();

    if (!adminExists) {
        if (context.url.pathname !== "/init" && context.url.pathname !== "/_actions/init") {
            return context.redirect("/init");
        }
    }

    if (adminExists) {
        if (context.url.pathname === "/init" || context.url.pathname === "/_actions/init") {
            return context.redirect("/");
        }
    }

    return await next();
});

const promotionMiddleware = defineMiddleware(async (context, next) => {
    const promotion = context.cookies.get("promotion-plat");
    if (promotion) {
        context.locals.promotion = promotion.value;
    } else {
        context.cookies.set("promotion-plat", "open", {
            path: "/",
            sameSite: "lax",
            maxAge: 60 * 5, // 5 minutes
        });
        context.locals.promotion = "open";
    }
    return await next();
});

export const onRequest = sequence(initMiddleware, authMiddleware, promotionMiddleware);
