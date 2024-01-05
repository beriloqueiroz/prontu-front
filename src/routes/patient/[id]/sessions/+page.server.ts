import { currencyToNumber, dateBrToIsoDate, isValidUuid } from '$lib/helpers';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../../../../app';
import type { Session } from '$lib/interface/session/session';
import { z } from 'zod';
import { http } from '$lib/server/http/server';
import { URL_BASE_SESSION } from '$env/static/private';

//change real
async function getSessions(patientId: string, professionalId: string): Promise<Session[]> {
  const response = await http.request(`${URL_BASE_SESSION}/sessions/professional/${professionalId}/${patientId}`);
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

  const sessions = await response.json() as Session[];

  sessions.forEach(s => {
    if (s.Cids) {
      s.CidsSvelte = JSON.pars(JSON.parse(s.Cids))
    }
  })

  return sessions;
}

async function addSession(session: Session): Promise<Session> {
  const response = await http.request(`${URL_BASE_SESSION}/sessions`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
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

export async function load({ params, locals }: PageServerLoad) {
  const patientId = params.id;
  const professionalId = locals.user?.username;
  if (!professionalId) {
    throw error(401, { message: "Erro ao buscar sessões" });
  }
  if (!isValidUuid(params.id)) {
    throw error(404, { message: "Erro ao buscar paciente" });
  }

  const sessions = await getSessions(patientId, professionalId);

  return { sessions };
}

const addSessionSchema = z.object({
  professionalId: z.string().uuid(),
  patientIds: z.string().uuid({ message: "Paciente inválido!" }).array(),
  amount: z.string().transform(currencyToNumber),
  startDate: z.coerce.date(),
  timeInMinutes: z.coerce.number().nullable().transform(v => v || 0),
  location: z.string().min(3, { message: "Digite um local válido" })
});

interface ObjetcEntries {
  professionalId: string,
  patientIds: string | string[],
  startDate: string,
  timeInMinutes: string | number,
  amount: string | number,
  location: string
}

export const actions: Actions = {
  addSession: async ({ request }) => {
    const data = await request.formData();

    const objects = Object.fromEntries(data) as unknown as ObjetcEntries;
    objects.patientIds = (objects.patientIds as string).split(",");

    objects.startDate = dateBrToIsoDate(objects.startDate);

    const zodResponse = addSessionSchema.safeParse(objects);

    if (!zodResponse.success) {
      throw error(400, {
        message: zodResponse.error.errors.map(err => err.message).join(", "),
        formDetail: zodResponse.error.errors
      });
    }

    const { professionalId, patientIds, amount, startDate, timeInMinutes, location } = zodResponse.data;

    const response = await addSession(
      {
        Professionals: [{ ProfessionalId: professionalId }],
        Patients: patientIds.map(p => ({ PatientId: p })),
        Amount: amount,
        StartDate: startDate,
        TimeInMinutes: timeInMinutes,
        Location: location,
        Origin: "none"
      });

    return response;
  }
};