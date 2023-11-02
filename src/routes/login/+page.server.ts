import { redirect, type Actions, error } from '@sveltejs/kit';
import { user } from '$lib/stores/user';
import { decodeToken } from '$lib/helper';
import { URL_BASE_AUTH } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {

  const authToken = cookies.get("AuthorizationToken");

  if (!authToken || authToken != '') return { clearUser: true }
  return { clearUser: false }

}

function parseLoginError(code: number): string {
  if (code === 401) return "Usuário ou senha inválidos!";
  if (code === 403) return "Confirme primeiramente seu e-mail";
  return "Erro interno!";
}

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = String(data.get('email'));
    const password = String(data.get('password'));

    const response = await fetch(`${URL_BASE_AUTH}/User/login/email`, {
      method: 'POST',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        email, password
      })
    });

    if (!response.ok) {
      throw error(response.status, parseLoginError(response.status));
    }

    const token = await response.text();
    const maxDays = 30;

    cookies.set('AuthorizationToken', token, {
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'strict',
      maxAge: maxDays * 60 * 60 * 24
    });

    user.set(decodeToken(token));

    throw redirect(303, '/');
  }
};