import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }): Promise<Response> => {
    const id = url.searchParams.get("id");
    const response: Response = await fetch(`http://localhost:5100/api/professional/${id}`, {
        method: 'GET'
    });
    if (response.status === 200) {
        return response;
    } else {
        return new Response("Internal server error", { status: 500 });
    }
}