import { error, type RequestHandler } from "@sveltejs/kit";
import { URL_BASE_BACKEND } from '$env/static/private';
import { http } from "$lib/server/http/server";


export const GET: RequestHandler = async ({ url, request }): Promise<Response> => {
  const id = request.headers.get("professionalId")
  // const response: Response = await http.request(`${URL_BASE_BACKEND}/session`, {
  //   method: 'GET',
  //   headers: {
  //     "content-type": "application/json",
  //     "accept": "application/json",
  //     "professionalId": `${id}`,
  //   },
  //   body: JSON.stringify({ professionalId: id })
  // });
  // if (!response.ok) {
  //   throw error(response.status, {
  //     message: response.statusText
  //   });
  // }
  // return new Response(await response.text());

  return new Response(JSON.stringify([
    {
      id,
      amount: 150,
      cids: [{ name: "transtorno x", code: "A1" }, { name: "transtorno Y", code: "A2" }],
      patientIds: ["36176df2-829d-4d9d-9f46-6c6b0c6c0fa5"],
      professionalId: "56fdd5a3-2f17-4b32-b9af-e0dd720a5e98",
      startDate: new Date(),
      endDate: new Date(),
      timeInMinutes: 50,
      notes: "esse é perturbado",
      forms: [{ link: "www.doido.com.br", name: "anamnese" }]
    },
    {
      id,
      amount: 150,
      cids: [{ name: "transtorno x", code: "A1" }, { name: "transtorno Y", code: "A2" }],
      patientIds: ["36176df2-829d-4d9d-9f46-6c6b0c6c0fa5"],
      professionalId: "56fdd5a3-2f17-4b32-b9af-e0dd720a5e98",
      startDate: new Date(),
      endDate: new Date(),
      timeInMinutes: 50,
      notes: "esse é perturbado",
      forms: [{ link: "www.doido.com.br", name: "anamnese" }]
    },
    {
      id,
      amount: 150,
      cids: [{ name: "transtorno x", code: "A1" }, { name: "transtorno Y", code: "A2" }],
      patientIds: ["36176df2-829d-4d9d-9f46-6c6b0c6c0fa5"],
      professionalId: "56fdd5a3-2f17-4b32-b9af-e0dd720a5e98",
      startDate: new Date(),
      endDate: new Date(),
      timeInMinutes: 50,
      notes: "esse é perturbado",
      forms: [{ link: "www.doido.com.br", name: "anamnese" }]
    }
  ]))
}