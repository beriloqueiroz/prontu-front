import { redirect, type Actions, error } from '@sveltejs/kit';
import { URL_BASE_AUTH, URL_BASE_BACKEND } from '$env/static/private';
import { http } from '$lib/server/http/server';
import { z } from 'zod';
import { isValidCPF, isValidPassword } from '$lib/helpers';
import { Institution } from '$lib/interface/professional/enums/institution';

const registerProfessionalSchema = z.object({
  name: z.string().trim().min(3, { message: "Email deve conter mais do que 3 caracteres" }),
  email: z.string().trim().email({ message: "Email inválido" }).min(1),
  document: z.custom((val) => typeof val === "string" ? isValidCPF(val) : false, { message: "CPF inválido!" }),
  professionalDocument: z.string().min(3, { message: "Insira um documento profissional válido!" }),
  professionalDocumentInstitution: z.nativeEnum(Institution,
    {
      errorMap: () => {
        return { message: "Selecione uma instituição!" }
      }
    }),
  password: z.custom((val) => typeof val === "string" ? isValidPassword(val).success : false, (val) => ({ message: isValidPassword(val).errors })),
  rePassword: z.string(),
}).refine((data) => data.password === data.rePassword, {
  message: "As senhas não são iguais",
  path: ["rePassword"]
});

/** @type {import('./$types').Actions} */
export const actions: Actions = {
  register: async ({ request }) => {
    const data = await request.formData();

    const zodResponse = registerProfessionalSchema.safeParse(Object.fromEntries(data));

    if (!zodResponse.success) {
      throw error(400, {
        message: zodResponse.error.errors.map(err => err.message).join(", "),
        formDetail: zodResponse.error.errors
      });
    }

    const { name, professionalDocument, document, email, professionalDocumentInstitution, rePassword, password } = {
      ...zodResponse.data,
      document: zodResponse.data.document.replaceAll(".", "").replaceAll("-", "")
    }


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
      const errors = await professionalResponse.json();
      throw error(professionalResponse.status, {
        message: errors.title
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