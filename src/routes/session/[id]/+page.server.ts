import { isValidUuid } from '$lib/helpers';
import type { Session } from '$lib/interface/session/session';
import { error, type Actions } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad } from '../../../app';

const editSession = z.object({
  professionalId: z.string().uuid(),
  id: z.string().uuid(),
  patientIds: z.string().uuid().array(),
  amount: z.coerce.number().nullable().transform(v => v || 0),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable(),
  notes: z.string().nullable(),
  timeInMinutes: z.coerce.number().nullable().transform(v => v || 0),
  cids: z.object({ code: z.string(), name: z.string(), observations: z.string() }).array(),
  forms: z.object({ name: z.string(), link: z.string() }).array(),
});

async function getSessionById(id: string): Promise<Response> {
  const patientResponse = {
    ok: true,
    status: 200,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any
  patientResponse.json = () => (
    {
      id,
      amount: 150,
      cids: [{ name: "transtorno x", code: "A01" }, { name: "transtorno Y", code: "A02" }],
      patientIds: ["36176df2-829d-4d9d-9f46-6c6b0c6c0fa5"],
      professionalId: "56fdd5a3-2f17-4b32-b9af-e0dd720a5e98",
      startDate: new Date(),
      endDate: new Date(),
      timeInMinutes: 50,
      notes: "esse é perturbado",
      forms: [{ link: "www.doido.com.br", name: "anamnese" }]
    }
  ) as Session
  return patientResponse as Response;
}

export async function load({ params, locals }: PageServerLoad) {
  const professionalId = locals.user?.username;
  const sessionId = params.id;
  if (!professionalId) {
    throw error(401, { message: "Erro ao buscar sessão" });
  }
  if (!isValidUuid(sessionId)) {
    throw error(404, { message: "Erro ao buscar sessão" });
  }
  const patientResponse = await getSessionById(sessionId)

  if (!patientResponse.ok) {
    const errors = await patientResponse.json();
    throw error(patientResponse.status, {
      message: errors.title
    });
  }

  const response = await patientResponse.json();

  return { session: response };
}

export const actions: Actions = {
  editSession: async ({ request }) => {
    const data = await request.formData();
    const zodResponse = editSession.safeParse(Object.fromEntries(data));

    if (!zodResponse.success) {
      throw error(400, {
        message: zodResponse.error.errors.map(err => err.message).join(", "),
        formDetail: zodResponse.error.errors
      });
    }

    const {
      id,
      amount,
      cids,
      patientIds,
      professionalId,
      startDate,
      endDate,
      timeInMinutes,
      notes,
      forms
    } = zodResponse.data;

    const response = await changeSession({
      id,
      amount,
      cids: cids.map(c => ({ ...c })),
      patientIds,
      professionalId,
      startDate,
      endDate: endDate || undefined,
      timeInMinutes,
      notes: notes || undefined,
      forms: forms.map(f => ({ ...f }))
    });

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

async function changeSession(session: Session): Promise<Response> {
  const patientResponse = {
    ok: true,
    status: 200,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any
  patientResponse.json = () => (
    {
      id: session.id,
      amount: 150,
      cids: [{ name: "transtorno x", code: "A1" }, { name: "transtorno Y", code: "A2" }],
      patientIds: ["36176df2-829d-4d9d-9f46-6c6b0c6c0fa5"],
      professionalId: "56fdd5a3-2f17-4b32-b9af-e0dd720a5e98",
      startDate: new Date(),
      endDate: new Date(),
      timeInMinutes: 50,
      notes: "esse é perturbado",
      forms: [{ link: "www.doido.com.br", name: "anamnese" }]
    }
  ) as Session
  return patientResponse as Response;
}