import { currencyToNumber, isValidUuid, jsonIsOk } from '$lib/helpers';
import type { Session } from '$lib/interface/session/session';
import { error, type Actions } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad } from '../../../app';
import { http } from '$lib/server/http/server';
import { URL_BASE_SESSION } from '$env/static/private';

const editSession = z.object({
  professionalId: z.string().uuid(),
  id: z.string().uuid(),
  patientIds: z.string(),
  amount: z.string().transform(currencyToNumber),
  startDate: z.coerce.date(),
  endDate: z.string().transform(date => new Date(date)),
  notes: z.string().nullable(),
  timeInMinutes: z.coerce.number().nullable().transform(v => v || 0),
  cids: z.string().nullable(),
  location: z.string().min(3, { message: "Digite um local válido" })
});

async function getSessionById(id: string, professionalId: string): Promise<Session> {
  const response = await http.request(`${URL_BASE_SESSION}/sessions/${id}`, {
    headers: {
      professionalId
    }
  });
  if (!response.ok) {
    let errors = { title: "" }
    try {
      errors = await response.json();
    } catch (err) {
      const errorsStr = await response.text();
      throw error(response.status, {
        message: errorsStr
      });
    }
    throw error(response.status, {
      message: errors.title
    });
  }

  const session = await response.json();

  if (session.Cids && jsonIsOk(session.Cids)) {
    const cids = JSON.parse(session.Cids)
    if (typeof cids !== 'object') {
      session.CidsSvelte = JSON.parse(cids)
    }
    session.CidsSvelte = JSON.parse(session.Cids)
  }

  return session;
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
  const session = await getSessionById(sessionId, professionalId)

  return { session };
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
      location
    } = zodResponse.data;

    const response = await changeSession({
      Id: id,
      Professionals: [{ ProfessionalId: professionalId }],
      Patients: patientIds.split(",").map(p => ({ PatientId: p })),
      Amount: amount,
      StartDate: startDate,
      TimeInMinutes: timeInMinutes,
      Location: location,
      Origin: "none",
      EndDate: endDate || undefined,
      Notes: notes || undefined,
      Cids: cids || undefined,
    }, professionalId);

    return response;
  }
};

async function changeSession(session: Session, professionalId: string): Promise<Session> {
  const response = await http.request(`${URL_BASE_SESSION}/sessions/${session.Id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      professionalId
    },
    body: JSON.stringify(
      session
    )
  });

  if (!response.ok) {
    let errors = { title: "" }
    try {
      errors = await response.json();
    } catch (err) {
      const errorsStr = await response.text();
      throw error(response.status, {
        message: errorsStr
      });
    }
    throw error(response.status, {
      message: errors.title
    });
  }

  const responseJson = await response.json();

  return responseJson;
}