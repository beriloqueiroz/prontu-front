import { error, type Handle } from "@sveltejs/kit";
import { decodeToken } from "$lib/helper";
import { URL_BASE_AUTH } from '$env/static/private';

export const authorizationMiddleware: Handle = async ({ event, resolve }): Promise<Response> => {
    // Authorized only path
    if (event.url.pathname.startsWith('/api/professional')) {
        const token = event.cookies.get("AuthorizationToken");
        if (!token) {
            return new Response(null, { status: 401 });
        }

        const tokenValid = await IsValidToken(token);

        if (!tokenValid) {
            throw error(401, {
                message: 'Not authorized'
            });
        }
    }

    return await resolve(event);
}

export async function IsValidToken(authToken: string): Promise<boolean> {
    const claims = decodeToken(authToken);
    if (!claims) return false;
    const authorizationResponse = await fetch(`${URL_BASE_AUTH}/User/authorization`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${authToken}`,
            "content-type": "application/json"
        }
    })
    return authorizationResponse.ok;
}