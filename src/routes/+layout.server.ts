import { redirect } from '@sveltejs/kit';

export async function load({ cookies, url }) {

  const token = cookies.get("AuthorizationToken");

  if ((!token || token == '') && !url.pathname.includes('/login') && !url.pathname.includes('/register')) {
    throw redirect(307, '/login');
  }
};