/* eslint-disable @typescript-eslint/no-explicit-any */
import { error } from '@sveltejs/kit';
import { apiBack } from '../../helpers/api-client';
/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  if (!params.id) throw error(404, "Not found");

  const professional = await apiBack.get(`/professional/${params.id}`);

  return professional.data;
}