import { redirect, type Actions, error } from '@sveltejs/kit';
import { URL_BASE_AUTH, URL_BASE_BACKEND } from '$env/static/private';
import { http } from '$lib/server/http/server';

/** @type {import('./$types').Actions} */
export const actions: Actions = {
  register: async ({ request }) => {
    const data = await request.formData();
    const email = String(data.get('email'));
    const password = String(data.get('password'));
    const rePassword = String(data.get('rePassword'));
    const name = String(data.get('name'));
    const document = String(data.get('document')).replaceAll(".", "").replaceAll("-", "");
    const professionalDocument = String(data.get('professionalDocument'));
    const professionalDocumentInstitution = String(data.get('professionalDocumentInstitution'));

    if (password != rePassword) {
      throw error(400, {
        message: "Senha e sua confirmação não conferem"
      });
    }

    const professionalResponse = await http.request(`${URL_BASE_BACKEND}/professional`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        email, name, document, professionalDocument, professionalDocumentInstitution
      })
    });

    if (!professionalResponse.ok) {
      const errors = await professionalResponse.text();
      throw error(professionalResponse.status, {
        message: errors
      });
    }

    const professionalResponseJson = await professionalResponse.json();

    const username = professionalResponseJson.id;
    //TODO, verificar quando erro em um dos serviçoes, auth or back

    const userResponse = await http.request(`${URL_BASE_AUTH}/User/register`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ email, password, rePassword, username })
      });

    if (!userResponse.ok) {
      const errors = await userResponse.text();
      throw error(userResponse.status, {
        message: errors
      });
    }

    throw redirect(303, '/login');
  }
};