import { error, type RequestHandler } from "@sveltejs/kit";
import { URL_BASE_BACKEND } from '$env/static/private';
import { http } from "$lib/server/http/server";


export const GET: RequestHandler = async ({ url }): Promise<Response> => {
    const id = url.searchParams.get("id");
    const response: Response = await http.request(`${URL_BASE_BACKEND}/professional/${id}`, {
        method: 'GET',
        headers: {
            "content-type": "application/json",
            "accept": "application/json",
        }
    });
    if (!response.ok) {
        throw error(response.status, {
            message: response.statusText
        });
    }
    return new Response(await response.text());
}