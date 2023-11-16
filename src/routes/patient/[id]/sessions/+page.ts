import type { PageLoad } from "../../../../app";

export const load = async function ({ data }: PageLoad) {
  return {
    sessions: data.sessions
  };
};