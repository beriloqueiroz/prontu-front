import type { PageLoad } from "../app";

export const load = async function ({ data }: PageLoad) {
  return {
    user: data.user,
    professional: data.professional
  };
};