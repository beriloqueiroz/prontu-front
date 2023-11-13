import { decodeToken } from '$lib/server/helper.js';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../app';
import type { Professional } from '$lib/interface/professional/professional';
import { http } from '$lib/server/http/server';
import { URL_BASE_BACKEND } from '$env/static/private';

export async function load({ cookies, url, locals }: PageServerLoad) {
  if (locals.user == null) {
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

      const professional = await getProfessional(user.username);

      return { user, professional };
    }
  }

  return {};
}

async function getProfessional(id: string): Promise<Professional> {
  const response: Response = await http.request(`${URL_BASE_BACKEND}/professional/${id}`, {
    method: 'GET',
    headers: {
      "content-type": "application/json",
      "accept": "application/json",
    }
  });
  if (!response.ok) {
    throw error(response.status, {
      message: response.statusText
    });
  }
  return await response.json();
}