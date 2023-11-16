import type { PageLoad } from "../../../app";

export const load = async function ({ data }: PageLoad) {
  return {
    patient: data.patient
  };
};