import { URL_BASE_BACKEND, URL_BASE_SESSION } from '$env/static/private';
import { currencyToNumber, dateBrToIsoDate } from '$lib/helpers';
import type { Phone } from '$lib/interface/professional/patient';
import type { Session } from '$lib/interface/session/session';
import { http } from '$lib/server/http/server';
import { error, type Actions } from '@sveltejs/kit';
import { z } from 'zod';

const addPatientSchema = z.object({
  name: z.string().trim().min(3, { message: "Email deve conter mais do que 3 caracteres" }),
  email: z.string().trim().nullable(),
  professionalId: z.string().uuid(),
  document: z.string().nullable(),
  // document: z.custom((val) => typeof val === "string" ? isValidCPF(val) : false, { message: "CPF inválido!" }),
  phone: z.string().nullable(),
  chatPhone: z.string().nullable(),
});

const addSessionSchema = z.object({
  professionalId: z.string().uuid(),
  patientIds: z.string().uuid({ message: "Paciente inválido!" }).array(),
  amount: z.string().transform(currencyToNumber),
  startDate: z.coerce.date(),
  timeInMinutes: z.coerce.number().nullable().transform(v => v || 0),
  location: z.string().min(3, { message: "Digite um local válido" })
});

async function addSession(session: Session): Promise<Session> {
  const response = await http.request(`${URL_BASE_SESSION}/sessions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
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
      document: zodResponse.data.document?.replaceAll(".", "").replaceAll("-", "")
    }
    const phones: Phone[] = [
      {
        isChat: true,
        value: chatPhone ?? ""
      },
      {
        isChat: false,
        value: phone ?? ""
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