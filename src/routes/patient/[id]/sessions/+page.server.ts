import { isValidUuid } from '$lib/helpers';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../../../../app';
import type { Session } from '$lib/interface/session/session';

export async function load({ params, locals }: PageServerLoad) {
  const patientId = params.id;
  const professionalId = locals.user?.username;
  if (!professionalId) {
    throw error(401, { message: "Erro ao buscar sessões" });
  }
  if (!isValidUuid(params.id)) {
    throw error(404, { message: "Erro ao buscar paciente" });
  }
  const patientResponse = {
    ok: true,
    status: 200,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any

  if (!patientResponse.ok) {
    const errors = await patientResponse.json();
    throw error(patientResponse.status, {
      message: errors.title
    });
  }

  patientResponse.json = () => ([
    {
      amount: 150,
      cid: [{ name: "transtorno x", code: "A1" }],
      patientIds: [patientId],
      professionalId: professionalId,
      startDate: new Date()
    }
  ]) as Session[]

  const response = await patientResponse.json();

  return { sessions: response };
}