import { URL_BASE_BACKEND } from '$env/static/private';
import { isValidUuid } from '$lib/helpers';
import { http } from '$lib/server/http/server';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../../../app';

export async function load({ params, locals, cookies }: PageServerLoad) {
  const professionalId = locals.user?.username;
  if (!professionalId) {
    throw error(401, { message: "Erro ao buscar paciente" });
  }
  if (!isValidUuid(params.id)) {
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