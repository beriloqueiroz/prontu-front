import { error, type RequestHandler } from "@sveltejs/kit";
import { URL_BASE_SESSION } from '$env/static/private';
import { http } from "$lib/server/http/server";


export const GET: RequestHandler = async ({ url, request }): Promise<Response> => {
  const id = request.headers.get("professionalId")
  const limit = url.searchParams.get("limit");
  const offset = url.searchParams.get("offset");
  const response: Response = await http.request(`${URL_BASE_SESSION}/sessions/professional/${id}?size=${limit}&page=${offset}`, {
    method: 'GET',
    headers: {
      "content-type": "application/json",
      "accept": "application/json",
    }
  });
  if (!response.ok) {
    let errors = { title: "" }
    try {
      errors = await response.json();
    } catch (err) {
      const errorsStr = await response.text();
      throw error(response.status, {
        message: errorsStr
      });
    }
    throw error(response.status, {
      message: errors.title
    });
  }

  return response;
}