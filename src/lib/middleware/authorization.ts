import type { Handle } from "@sveltejs/kit";
import { authenticate } from "$lib/helper";

export const authorizationMiddleware: Handle = async ({ event, resolve }): Promise<Response> => {
    // Authorized only path
    if (event.url.pathname.startsWith('/api/professional')) {
        const token = event.cookies.get("AuthorizationToken");
        if (!token || !token) {
            return new Response(null, { status: 401 });
        }

        const tokenValid = await authenticate(token);

        if (!tokenValid) {
            return new Response(null, { status: 401 });
        }
    }

    return await resolve(event);
}