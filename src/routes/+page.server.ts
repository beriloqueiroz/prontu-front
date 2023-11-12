import { URL_BASE_BACKEND } from '$env/static/private';
import type { Phone } from '$lib/interface/professional/patient';
import { http } from '$lib/server/http/server';
import { error, type Actions } from '@sveltejs/kit';


export const actions: Actions = {
  addPatient: async ({ request }) => {
    const data = await request.formData();
    const email = String(data.get('email'));
    const professionalId = String(data.get('professionalId'));
    const phone = String(data.get('phone'));
    const chatPhone = String(data.get('chatPhone'));
    const name = String(data.get('name'));
    const document = String(data.get('document')).replaceAll(".", "").replaceAll("-", "");

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