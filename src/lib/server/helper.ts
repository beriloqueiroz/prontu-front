import jwt from 'jsonwebtoken';
import { redirect } from '@sveltejs/kit';
import type { User } from '$lib/interface/user/user';

export function decodeToken(token: string): User {
  try {
    return jwt.verify(token, "0xa3fa6d97f4807e145b37451fc344e58c") as User; //tem que botar em variável de ambiente
  } catch (e) {
    throw redirect(302, "/login");
  }
}