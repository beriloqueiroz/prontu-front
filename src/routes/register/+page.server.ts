import { fail, redirect, type Actions } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function load({ url }: any) {
  const registerIsSuccess = url.searchParams.get('register');
  if (registerIsSuccess === 'success') {
    console.log("sucesso ao registrar");
  }
}

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

    const professionalResponse = await fetch('http://localhost:5100/api/professional', {
      method: "POST",
      body: JSON.stringify({
        email, name, document, professionalDocument
      })
    });

    if (!professionalResponse.ok) {
      return fail(400, { errors: professionalResponse.text() });
    }

    const professionalResponseJson = await professionalResponse.json();

    const username = professionalResponseJson.id;
    //TODO, verificar quando erro em um dos serviçoes, auth or back

    const userResponse = await fetch('http://localhost:5000/User/register',
      {
        method: "POST",
        body: JSON.stringify({ email, password, rePassword, username })
      });

    if (!userResponse.ok) {
      return fail(400, { errors: userResponse.text() });
    }

    throw redirect(303, '/login');
  }
};