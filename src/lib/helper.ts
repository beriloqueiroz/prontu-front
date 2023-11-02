import jwt from 'jsonwebtoken';
import type { User } from "$lib/interface/user";

export async function authenticate(authToken: string): Promise<boolean> {
  const claims = decodeToken(authToken);
  if (!claims) return false;
  const authorizationResponse = await fetch("http://localhost:5000/User/authorization", {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  })
  return authorizationResponse.status === 200;
}

export function decodeToken(token: string): User {
  return jwt.verify(token, "0xa3fa6d97f4807e145b37451fc344e58c") as User; //tem que botar em variável de ambiente
}