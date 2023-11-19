import { URL_BASE_BACKEND } from '$env/static/private';
import { currencyToNumber, dateBrToIsoDate, isValidCPF } from '$lib/helpers';
import type { Phone } from '$lib/interface/professional/patient';
import type { Session } from '$lib/interface/session/session';
import { http } from '$lib/server/http/server';
import { error, type Actions } from '@sveltejs/kit';
import { z } from 'zod';

const addPatientSchema = z.object({
  name: z.string().trim().min(3, { message: "Email deve conter mais do que 3 caracteres" }),
  email: z.string().trim().email({ message: "Email inválido" }).min(1),
  professionalId: z.string().uuid(),
  document: z.custom((val) => typeof val === "string" ? isValidCPF(val) : false, { message: "CPF inválido!" }),
  phone: z.string().min(15, { message: "Telefone inválido" }),
  chatPhone: z.string().min(15, { message: "Whatsapp inválido" }),
});

const addSessionSchema = z.object({
  professionalId: z.string().uuid(),
  patientIds: z.string().uuid({ message: "Paciente inválido!" }).array(),
  amount: z.string().transform(currencyToNumber),
  startDate: z.coerce.date(),
  timeInMinutes: z.coerce.number().nullable().transform(v => v || 0)
});

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

interface ObjetcEntries {
  professionalId: string,
  patientIds: string | string[],
  startDate: string,
  timeInMinutes: string | number,
  amount: string | number
}

export const actions: Actions = {
  addPatient: async ({ request }) => {
    const data = await request.formData();
    const zodResponse = addPatientSchema.safeParse(Object.fromEntries(data));

    if (!zodResponse.success) {
      throw error(400, {
        message: zodResponse.error.errors.map(err => err.message).join(", "),
        formDetail: zodResponse.error.errors
      });
    }

    const { name, document, email, professionalId, phone, chatPhone } = {
      ...zodResponse.data,
      document: zodResponse.data.document.replaceAll(".", "").replaceAll("-", "")
    }
    const phones: Phone[] = [
      {
        isChat: true,
        value: chatPhone
      },
      {
        isChat: false,
        value: phone
      }
    ]

    const response = await http.request(`${URL_BASE_BACKEND}/professional/${professionalId}`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        email, name, document, phones
      })
    });

    if (!response.ok) {
      const errors = await response.json();
      throw error(response.status, {
        message: errors.title
      });
    }

    const responseJson = await response.json();

    return responseJson;
  },
  addSessionByProfessional: async ({ request }) => {
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