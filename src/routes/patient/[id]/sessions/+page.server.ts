import { isValidUuid } from '$lib/helpers';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../../../../app';
import type { Session } from '$lib/interface/session/session';
import { z } from 'zod';

//change real
async function getSessions(patientId: string, professionalId: string): Promise<Response> {
  const patientResponse = {
    ok: true,
    status: 200,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any
  patientResponse.json = () => ([
    {
      id: "56fdd5a3-2f17-4b32-b9af-e0dd720a5e98",
      amount: 150,
      cids: [{ name: "transtorno x", code: "A1" }],
      patientIds: [patientId],
      professionalId: professionalId,
      startDate: new Date()
    }
  ]) as Session[]
  return patientResponse as Response;
}

async function addSession(session: Session): Promise<Response> {
  const patientResponse = {
    ok: true,
    status: 200,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any
  patientResponse.json = () => ([
    session,
    {
      id: "56fdd5a3-2f17-4b32-b9af-e0dd720a5e98",
      amount: 150,
      cids: [{ name: "transtorno x", code: "A1" }],
      patientIds: session.patientIds,
      professionalId: session.professionalId,
      startDate: new Date()
    }
  ]) as Session[]
  return patientResponse as Response;
}

export async function load({ params, locals }: PageServerLoad) {
  const patientId = params.id;
  const professionalId = locals.user?.username;
  if (!professionalId) {
    throw error(401, { message: "Erro ao buscar sessões" });
  }
  if (!isValidUuid(params.id)) {
    throw error(404, { message: "Erro ao buscar paciente" });
  }

  const patientResponse = await getSessions(patientId, professionalId);


  if (!patientResponse.ok) {
    const errors = await patientResponse.json();
    throw error(patientResponse.status, {
      message: errors.title
    });
  }

  const response = await patientResponse.json();

  return { sessions: response };
}

const addPatientSchema = z.object({
  professionalId: z.string().uuid(),
  patientIds: z.string().uuid().array(),
  amount: z.coerce.number().nullable().transform(v => v || 0),
  startDate: z.coerce.date(),
  timeInMinutes: z.coerce.number().nullable().transform(v => v || 0)
});

export const actions: Actions = {
  addSession: async ({ request }) => {
    const data = await request.formData();
    const zodResponse = addPatientSchema.safeParse(Object.fromEntries(data));

    if (!zodResponse.success) {
      throw error(400, {
        message: zodResponse.error.errors.map(err => err.message).join(", "),
        formDetail: zodResponse.error.errors
      });
    }

    const { professionalId, patientIds, amount, startDate, timeInMinutes } = zodResponse.data;

    const response = await addSession({ professionalId, patientIds, amount, startDate, timeInMinutes });

    if (!response.ok) {
      const errors = await response.json();
      throw error(response.status, {
        message: errors.title
      });
    }

    const responseJson = await response.json();

    return responseJson;
  }
};