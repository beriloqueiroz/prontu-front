import { error, type RequestHandler } from "@sveltejs/kit";
import { URL_BASE_AUTH } from '$env/static/private';
import { http } from "$lib/server/http/server";

export const DELETE: RequestHandler = async ({ cookies }): Promise<Response> => {
    const response: Response = await http.request(`${URL_BASE_AUTH}/User/logout`, {
        method: 'DELETE',
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${cookies.get("AuthorizationToken")}`
        }
    });

    if (!response.ok) {
        throw error(response.status, {
            message: response.statusText
        });
    }
    cookies.delete("AuthorizationToken");//esse não funciona
    cookies.set('AuthorizationToken', '', {
        httpOnly: true,
        path: '/',
        secure: true,
        sameSite: 'strict',
        maxAge: 0
    });
    return new Response(await response.text());
}