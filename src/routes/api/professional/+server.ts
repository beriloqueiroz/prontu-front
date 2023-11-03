import { error, type RequestHandler } from "@sveltejs/kit";
import { URL_BASE_BACKEND } from '$env/static/private';


export const GET: RequestHandler = async ({ url }): Promise<Response> => {
    const id = url.searchParams.get("id");
    console.log("🚀 ~ file: +server.ts:9 ~ constGET:RequestHandler= ~ URL_BASE_BACKEND:", URL_BASE_BACKEND)
    const response: Response = await fetch(`${URL_BASE_BACKEND}/professional/${id}`, {
        method: 'GET',
        headers: {
            "content-type": "application/json"
        }
    });
    console.log("🚀 ~ file: +server.ts:10 ~ constGET:RequestHandler= ~ response:", response)
    const respon = await response.json();
    console.log("🚀 ~ file: +server.ts:14 ~ constGET:RequestHandler= ~ respon:", respon)
    if (!response.ok) {
        throw error(response.status, {
            message: response.statusText
        });
    }
    return response;
}