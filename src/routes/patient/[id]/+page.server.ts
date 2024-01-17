import { error, type Actions } from '@sveltejs/kit';
import { http } from '$lib/server/http/server';
import { URL_BASE_BACKEND } from '$env/static/private';
import type { Phone } from '$lib/interface/professional/patient';
import { z } from 'zod';
import { currencyToNumber, isValidCPF } from '$lib/helpers';
import { allSessionTypes } from '$lib/interface/professional/enums/sessionType';
import { allPaymentTypes } from '$lib/interface/professional/enums/paymentType';

const editPatientGeneralSchema = z.object({
  name: z.string().trim().min(3, { message: "Email deve conter mais do que 3 caracteres" }),
  email: z.string().trim().email({ message: "Email inválido" }).min(1),
  id: z.string().uuid(),
  professionalId: z.string().uuid(),
  document: z.custom((val) => typeof val === "string" ? isValidCPF(val) : false, { message: "CPF inválido!" }),
  phone: z.string().min(15, { message: "Telefone inválido" }),
  chatPhone: z.string().min(15, { message: "Whatsapp inválido" }),
  isActive: z.coerce.boolean()
});

const editPatientFinancialSchema = z.object({
  id: z.string().uuid(),
  professionalId: z.string().uuid(),
  defaultSessionPrice: z.string().transform(currencyToNumber),
  estimatedSessionsByWeek: z.coerce.number().min(1, { message: "A Quantidade deve ser maior do que 1" }),
  estimatedTimeSessionInMinutes: z.coerce.number().min(1, { message: "O Tempo deve ser maior do que 1 minuto" }),
  sessionType: z.enum([allSessionTypes[0].toString(), ...allSessionTypes.map(elem => elem.toString())],
    {
      errorMap: () => ({ message: 'Selecione o tipo de sessão!' })
    }).transform(Number),
  paymentType: z.enum([allPaymentTypes[0].toString(), ...allPaymentTypes.map(elem => elem.toString())],
    {
      errorMap: () => ({ message: 'Selecione o tipo de pagamento!' })
    }).transform(Number),
  paymentPeriodInDays: z.coerce.number(),
  sessionQuantityPerPayment: z.coerce.number()
});

const editPatientPersonalSchema = z.object({
  id: z.string().uuid(),
  professionalId: z.string().uuid(),
  street: z.string().nullable(),
  neighborhood: z.string().nullable(),
  city: z.string().nullable(),
  number: z.string().nullable(),
  country: z.string().nullable(),
  zipCode: z.string().nullable(),
  region: z.string().nullable(),
  contact: z.string().nullable(),
  phones: z.string().nullable(),
  othersInfos: z.string().nullable(),
  observations: z.string().nullable()
});


export const actions: Actions = {
  editGeneral: async ({ request }) => {
    const data = await request.formData();
    const zodResponse = editPatientGeneralSchema.safeParse(Object.fromEntries(data));

    if (!zodResponse.success) {
      throw error(400, {
        message: zodResponse.error.errors.map(err => err.message).join(", "),
        formDetail: zodResponse.error.errors
      });
    }

    const { name, document, email, id, professionalId, phone, chatPhone, isActive } = {
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

    const response = await http.request(`${URL_BASE_BACKEND}/professional/${professionalId}/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        email, name, document, phones, isActive
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
  editFinancial: async ({ request }) => {
    const data = await request.formData();
    const zodResponse = editPatientFinancialSchema.safeParse(Object.fromEntries(data));

    if (!zodResponse.success) {
      throw error(400, {
        message: zodResponse.error.errors.map(err => err.message).join(", "),
        formDetail: zodResponse.error.errors
      });
    }

    const {
      id,
      professionalId,
      defaultSessionPrice,
      estimatedSessionsByWeek,
      estimatedTimeSessionInMinutes,
      sessionType,
      paymentType,
      paymentPeriodInDays,
      sessionQuantityPerPayment } = zodResponse.data;

    const response = await http.request(`${URL_BASE_BACKEND}/professional/${professionalId}/${id}/financial-info`, {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        defaultSessionPrice,
        estimatedSessionsByWeek,
        estimatedTimeSessionInMinutes,
        sessionType,
        paymentType,
        paymentPeriodInDays,
        sessionQuantityPerPayment
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
  editPersonal: async ({ request }) => {
    const data = await request.formData();
    const zodResponse = editPatientPersonalSchema.safeParse(Object.fromEntries(data));

    if (!zodResponse.success) {
      throw error(400, {
        message: zodResponse.error.errors.map(err => err.message).join(", "),
        formDetail: zodResponse.error.errors
      });
    }

    const {
      id,
      professionalId,
      street,
      neighborhood,
      city,
      number,
      country,
      zipCode,
      region,
      contact,
      phones,
      othersInfos,
      observations,
    } = zodResponse.data;

    const response = await http.request(`${URL_BASE_BACKEND}/professional/${professionalId}/${id}/personal-form`, {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        id,
        professionalId,
        street,
        neighborhood,
        city,
        number,
        country,
        zipCode,
        region,
        contact,
        phones,
        othersInfos,
        observations,
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
  }
};