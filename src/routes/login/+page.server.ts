import { fail, redirect, type Actions } from '@sveltejs/kit';
import { user } from '$lib/stores/user';
import { decodeToken } from '$lib/helper';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {

  const authToken = cookies.get("AuthorizationToken");

  if (!authToken || authToken != '') return { clearUser: true }
  return { clearUser: false }

}

/** @type {import('./$types').Actions} */
export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = String(data.get('email'));
    const password = String(data.get('password'));

    const res = await fetch('/User/login/email', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      })
    });

    if (!res.ok) {
      return fail(400, { errors: res.text() });
    }
    const token = await res.text();
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