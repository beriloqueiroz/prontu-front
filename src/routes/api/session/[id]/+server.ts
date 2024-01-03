import { error, type RequestHandler } from "@sveltejs/kit";
import { URL_BASE_SESSION } from '$env/static/private';
import { http } from "$lib/server/http/server";


export const DELETE: RequestHandler = async ({ request, params }): Promise<Response> => {
  const id = request.headers.get("professionalId")
  const sessionId = params["id"];
  const response: Response = await http.request(`${URL_BASE_SESSION}/sessions/professional/${id}/${sessionId}`, {
    method: 'DELETE',
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