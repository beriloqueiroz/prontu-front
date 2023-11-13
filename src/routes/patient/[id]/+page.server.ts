import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../../../app';
import { http } from '$lib/server/http/server';
import { URL_BASE_BACKEND } from '$env/static/private';
import type { Phone } from '$lib/interface/professional/patient';
import { z } from 'zod';
import { isValidCPF } from '$lib/helpers';

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

const editPatientSchema = z.object({
  name: z.string().trim().min(3, { message: "Email deve conter mais do que 3 caracteres" }),
  email: z.string().trim().email({ message: "Email inválido" }).min(1),
  id: z.string().uuid(),
  professionalId: z.string().uuid(),
  document: z.custom((val) => typeof val === "string" ? isValidCPF(val) : false, { message: "CPF inválido!" }),
  phone: z.string().min(15, { message: "Telefone inválido" }),
  chatPhone: z.string().min(15, { message: "Whatsapp inválido" }),
});


export const actions: Actions = {
  editPatient: async ({ request }) => {
    const data = await request.formData();
    const zodResponse = editPatientSchema.safeParse(Object.fromEntries(data));

    if (!zodResponse.success) {
      throw error(400, {
        message: zodResponse.error.errors.map(err => err.message).join(", ")
      });
    }

    const { name, document, email, id, professionalId, phone, chatPhone } = {
      ...zodResponse.data,
      document: zodResponse.data.document.replaceAll(".", "").replaceAll("-", "")
    }

    const phones: Phone[] = [
      {
        isChat: true,
        value: chatPhone
      },
      {
        isChat: false,
        value: phone
      }
    ]

    const response = await http.request(`${URL_BASE_BACKEND}/professional/${professionalId}/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        email, name, document, phones
      })
    });

    if (!response.ok) {
      const errors = await response.json();
      throw error(response.status, {
        message: errors.title
      });
    }

    const responseJson = await response.json();

    return responseJson;
  }
};