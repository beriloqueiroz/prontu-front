import { URL_BASE_AUTH, URL_BASE_BACKEND } from '$env/static/private';
import { decodeToken } from '$lib/server/helper';
import { error, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  edit: async ({ request }) => {
    const data = await request.formData();
    const name = String(data.get('name'));
    const email = String(data.get('email'));
    const id = String(data.get('id'));
    const document = String(data.get('document')).replaceAll(".", "").replaceAll("-", "");
    const professionalDocument = String(data.get('professionalDocument'));

    const professionalResponse = await fetch(`${URL_BASE_BACKEND}/professional/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        name, professionalDocument, document, email
      })
    });

    if (!professionalResponse.ok) {
      const errors = await professionalResponse.text();
      throw error(professionalResponse.status, {
        message: errors
      });
    }

    const professionalResponseJson = await professionalResponse.json();

    return professionalResponseJson;
  },
  editEmail: async ({ request, cookies }) => {
    const token = cookies.get("AuthorizationToken");
    if (!token) throw error(500, "erro ao tentar salvar com token informado!")
    const user = decodeToken(token);
    const data = await request.formData();
    const email = String(data.get('email'));

    if (user?.email === email) {
      throw error(400, "Não há mudança no email!")
    }
    const userResponse = await fetch(`${URL_BASE_AUTH}/User/change-email`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email })
      });

    if (!userResponse.ok) {
      const errors = await userResponse.text();
      throw error(userResponse.status, {
        message: errors
      });
    }


    /* TODO aqui tem que salvar o email no backend também. Tem o problema de não confirmação do email pelo usuário e
     o email não tiver sido de fato alterado.
    */
  },
  editPassoword: async ({ request, cookies }) => {
    const data = await request.formData();
    const newPassword = String(data.get('password'));
    const oldPassword = String(data.get('oldPassword'));

    const userResponse = await fetch(`${URL_BASE_AUTH}/User/change-password`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${cookies.get("AuthorizationToken")}`,
        },
        body: JSON.stringify({ password: newPassword, oldPassword })
      });

    if (!userResponse.ok) {
      const errors = await userResponse.text();
      throw error(userResponse.status, {
        message: errors
      });
    }


    /* TODO aqui tem que salvar o email no backend também. Tem o problema de não confirmação do email pelo usuário e
     o email não tiver sido de fato alterado.
    */
  }
};