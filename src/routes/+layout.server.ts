import { decodeToken } from '$lib/server/helper.js';
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
  let user = null;

  try {
    user = decodeToken(token);
  } catch (error) {
    cookies.delete("AuthorizationToken");
    locals.user = null;
    return {};
  }

  if (token && !url.pathname.includes('/login') &&
    !url.pathname.includes('/register')) {
    locals.user = user;
    return { user };
  }

  return {};
}