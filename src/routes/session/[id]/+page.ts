import type { PageLoad } from "../../../app";

export const load = async function ({ data }: PageLoad) {
  console.log("🚀 ~ file: +page.ts:4 ~ load ~ data:", data)
  return {
    session: data.session
  };
};