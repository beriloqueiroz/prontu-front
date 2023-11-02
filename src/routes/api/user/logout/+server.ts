import { error, type RequestHandler } from "@sveltejs/kit";
import { URL_BASE_AUTH } from '$env/static/private';

export const DELETE: RequestHandler = async ({ cookies }): Promise<Response> => {
    const response: Response = await fetch(`${URL_BASE_AUTH}/User/logout`, {
        method: 'DELETE',
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${cookies.get("AuthorizationToken")}`
        }
    });
    console.log('logout server');

    if (!response.ok) {
        throw error(response.status, {
            message: response.statusText
        });
    }
    cookies.delete("AuthorizationToken");
    return response;
}