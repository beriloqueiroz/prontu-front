import { fail, redirect } from '@sveltejs/kit';
import { apiAuth } from '../../helpers/api-client.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {

  const token = cookies.get("AuthorizationToken");

  if (token && token != '') {
    const res = await apiAuth.get('/User/authorization', { headers: { Authorization: token } });
    if (res.status === 200)
      throw redirect(302, '/');
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = String(data.get('email'));
    const password = String(data.get('password'));

    const res = await apiAuth.post('/User/login/email', { email, password });

    if (res.status !== 201 && res.status !== 200) {
      return fail(400, { errors: res.data });
    }

    const maxDays = 30;

    cookies.set('AuthorizationToken', `Bearer ${res.data}`, {
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'strict',
      maxAge: maxDays * 60 * 60 * 24
    });

    throw redirect(303, '/');
  }
};