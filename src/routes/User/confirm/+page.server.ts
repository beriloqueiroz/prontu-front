import { URL_BASE_AUTH } from '$env/static/private';
import { http } from '$lib/server/http/server';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../../../app';

export async function load({ url }: PageServerLoad) {
  const token = url.searchParams.get('token');
  const id = url.searchParams.get('id');
  if (!token || !id) {
    throw error(401, { message: "Erro ao confirmar email" });
  }
  const response = await confirm(url.pathname + url.search)

  if (!response) {
    return { confirmed: false };
  }

  return { confirmed: true };
}

async function confirm(path: string): Promise<boolean> {
  const response = await http.request(`${URL_BASE_AUTH}${path}`);

  return response.ok;
}