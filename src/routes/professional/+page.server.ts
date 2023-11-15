import { URL_BASE_AUTH, URL_BASE_BACKEND } from '$env/static/private';
import { http } from '$lib/server/http/server';
import { decodeToken } from '$lib/server/helper';
import { error, type Actions, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { allInstitution } from '$lib/interface/professional/enums/institution';
import { isValidCPF, isValidPassword } from '$lib/helpers';

const editProfessionalSchema = z.object({
  name: z.string().trim().min(3, { message: "Email deve conter mais do que 3 caracteres" }),
  email: z.string().trim().email({ message: "Email inválido" }).min(1),
  id: z.string().uuid(),
  document: z.custom((val) => typeof val === "string" ? isValidCPF(val) : false, { message: "CPF inválido!" }),
  professionalDocument: z.string().min(3, { message: "Insira um documento profissional válido!" }),
  professionalDocumentInstitution: z.enum([allInstitution[0].toString(), ...allInstitution.map(elem => elem.toString())]),
});

const editPasswordSchema = z.object({
  password: z.custom((val) => typeof val === "string" ? isValidPassword(val).success : false, (val) => ({ message: isValidPassword(val).errors })),
  oldPassword: z.string().min(1),
});

const editEmailSchema = z.object({
  email: z.string().trim().email({ message: "Email inválido" }).min(1),
});

export const actions: Actions = {
  edit: async ({ request }) => {
    const data = await request.formData();

    const zodResponse = editProfessionalSchema.safeParse(Object.fromEntries(data));

    if (!zodResponse.success) {
      throw error(400, {
        message: zodResponse.error.errors.map(err => err.message).join(", "),
        formDetail: zodResponse.error.errors
      });
    }

    const { name, professionalDocument, document, email, professionalDocumentInstitution, id } = {
      ...zodResponse.data,
      document: zodResponse.data.document.replaceAll(".", "").replaceAll("-", "")
    }

    const professionalResponse = await http.request(`${URL_BASE_BACKEND}/professional/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        name, professionalDocument, document, email, professionalDocumentInstitution
      })
    });

    if (!professionalResponse.ok) {
      const errors = await professionalResponse.json();
      throw error(professionalResponse.status, {
        message: errors.title
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
      throw error(400, "Oxe, num mudou foi nada aí!")
    }

    const zodResponse = editEmailSchema.safeParse(Object.fromEntries(data));

    if (!zodResponse.success) {
      throw error(400, {
        message: zodResponse.error.errors.map(err => err.message).join(", "),
        formDetail: zodResponse.error.errors
      });
    }

    const userResponse = await http.request(`${URL_BASE_AUTH}/User/change-email?email=${email}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email })
      });

    if (!userResponse.ok) {
      const errors = await userResponse.json();
      throw error(userResponse.status, {
        message: errors.title
      });
    }


    /* TODO aqui tem que salvar o email no backend também. Tem o problema de não confirmação do email pelo usuário e
     o email não tiver sido de fato alterado.
    */
  },

  editPass: async ({ request, cookies }) => {
    const data = await request.formData();
    const newPassword = String(data.get('password'));
    const oldPassword = String(data.get('oldPassword'));

    const zodResponse = editPasswordSchema.safeParse(Object.fromEntries(data));

    if (!zodResponse.success) {
      throw error(400, {
        message: zodResponse.error.errors.map(err => err.message).join(", "),
        formDetail: zodResponse.error.errors
      });
    }

    const userResponse = await http.request(`${URL_BASE_AUTH}/User/change-password`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${cookies.get("AuthorizationToken")}`,
        },
        body: JSON.stringify({ newPassword, oldPassword })
      });

    if (!userResponse.ok) {
      const errors = await userResponse.json();
      throw error(userResponse.status, {
        message: errors.title
      });
    }

    cookies.delete("AuthorizationToken");//esse não funciona
    cookies.set('AuthorizationToken', '', {
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'strict',
      maxAge: 0
    });

    redirect(300, "/login")
  }
};