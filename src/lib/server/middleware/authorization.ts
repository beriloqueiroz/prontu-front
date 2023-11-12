import { URL_BASE_AUTH } from '$env/static/private';
import { http } from '$lib/server/http/server';
import { decodeToken } from "$lib/server/helper";
import type { Handle } from '@sveltejs/kit';

export const authorizationMiddleware: Handle = async ({ event, resolve }): Promise<Response> => {
    if (event.url.pathname.startsWith('/api/professional')) {
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
