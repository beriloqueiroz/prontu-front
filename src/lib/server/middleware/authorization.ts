import { URL_BASE_AUTH } from '$env/static/private';
import { http } from '$lib/server/http/server';
import { decodeToken } from "$lib/server/helper";
import type { Handle } from '@sveltejs/kit';

export const authorizationMiddleware: Handle = async ({ event, resolve }): Promise<Response> => {
    if (event.url.pathname === "/") {
        event.locals.user = null
        return await resolve(event);
    }

    if (!event.url.pathname.startsWith('/login') &&
        !event.url.pathname.startsWith('/register') &&
        !event.url.pathname.startsWith('/User')
    ) {
        const token = event.cookies.get("AuthorizationToken");

        if (!token) {
            return new Response(null, { status: 401 });
        }

        const tokenValidationResponse = await IsValidToken(token);

        if (!tokenValidationResponse.ok) {
            if (tokenValidationResponse.status === 401) {
                event.cookies.delete('AuthorizationToken');
                event.cookies.set('AuthorizationToken', '', {
                    httpOnly: true,
                    path: '/',
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 1 * 60 * 60 * 24
                });

                return new Response(null, { status: 401, statusText: "Não Autorizado" });
            }

            return tokenValidationResponse;
        }

        event.locals.user = decodeToken(token);
        console.log("🚀 ~ constauthorizationMiddleware:Handle= ~ event.locals.user:", event.locals.user)
    }

    return await resolve(event);
}

async function IsValidToken(authToken: string): Promise<Response> {
    const claims = decodeToken(authToken);
    if (!claims) return new Response(null, { status: 401 });

    const authorizationResponse = await http.request(`${URL_BASE_AUTH}/User/authorization`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${authToken}`,
            "content-type": "application/json"
        },
    })

    return authorizationResponse;
}
