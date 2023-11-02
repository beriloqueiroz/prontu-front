import { decodeToken } from '$lib/helper.js';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../app';

export async function load({ cookies, url, locals }: PageServerLoad) {
  const token = cookies.get("AuthorizationToken");
  if (
    (!token || token === '') &&
    !url.pathname.includes('/login') &&
    !url.pathname.includes('/register')
  ) {
    throw redirect(307, '/login');
  }

  if (token && !url.pathname.includes('/login') &&
    !url.pathname.includes('/register')) {
    const user = decodeToken(token);
    locals.username = user.username;
    return { user };
  }

  return {};
}