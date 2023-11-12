import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../../../app';
import { http } from '$lib/server/http/server';
import { URL_BASE_BACKEND } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals, cookies }: PageServerLoad) {
  const professionalId = locals.user?.username;
  if (!professionalId) {
    throw error(401, { message: "Erro ao buscar paciente" });
  }
  const regex = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  if (!regex.test(params.id)) {
    throw error(404, { message: "Erro ao buscar paciente" });
  }
  const patientResponse = await http.request(`${URL_BASE_BACKEND}/professional/${professionalId}/${params.id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${cookies.get("AuthorizationToken")}`
    }
  });

  if (!patientResponse.ok) {
    const errors = await patientResponse.json();
    throw error(patientResponse.status, {
      message: errors.title
    });
  }

  const response = await patientResponse.json();

  return { patient: response };
}