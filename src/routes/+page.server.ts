import { URL_BASE_BACKEND } from '$env/static/private';
import { isValidCPF } from '$lib/helpers';
import type { Phone } from '$lib/interface/professional/patient';
import { http } from '$lib/server/http/server';
import { error, type Actions } from '@sveltejs/kit';
import { z } from 'zod';

const addPatientSchema = z.object({
  name: z.string().trim().min(3, { message: "Email deve conter mais do que 3 caracteres" }),
  email: z.string().trim().email({ message: "Email inválido" }).min(1),
  professionalId: z.string().uuid(),
  document: z.custom((val) => typeof val === "string" ? isValidCPF(val) : false, { message: "CPF inválido!" }),
  phone: z.string().min(15, { message: "Telefone inválido" }),
  chatPhone: z.string().min(15, { message: "Whatsapp inválido" }),
});

export const actions: Actions = {
  addPatient: async ({ request }) => {
    const data = await request.formData();
    const zodResponse = addPatientSchema.safeParse(Object.fromEntries(data));

    if (!zodResponse.success) {
      throw error(400, {
        message: zodResponse.error.errors.map(err => err.message).join(", ")
      });
    }

    const { name, document, email, professionalId, phone, chatPhone } = {
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

    const response = await http.request(`${URL_BASE_BACKEND}/professional/${professionalId}`, {
      method: "POST",
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