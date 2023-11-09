import { redirect, type Handle, error } from "@sveltejs/kit";
import { decodeToken } from "$lib/server/helper";
import { BACKEND_TIMEOUT, URL_BASE_AUTH } from '$env/static/private';
import { timeout } from "../timeouts";

export const authorizationMiddleware: Handle = async ({ event, resolve }): Promise<Response> => {
    if (event.url.pathname.startsWith('/api/professional')) {
        const token = event.cookies.get("AuthorizationToken");
        if (!token) {
            return new Response(null, { status: 401 });
        }

        const tokenValid = await IsValidToken(token);

        if (!tokenValid) {
            event.cookies.delete('AuthorizationToken');
            throw redirect(301, "/login");
        }

        event.locals.user = decodeToken(token);
    }

    return await resolve(event);
}

async function IsValidToken(authToken: string): Promise<boolean> {
    const claims = decodeToken(authToken);
    if (!claims) return false;

    const authorizationResponse = await fetch(`${URL_BASE_AUTH}/User/authorization`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${authToken}`,
            "content-type": "application/json"
        },
    })
    return authorizationResponse.ok;
}