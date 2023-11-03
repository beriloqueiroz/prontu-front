import { authorizationMiddleware } from '$lib/server/middleware/authorization';
import { sequence } from '@sveltejs/kit/hooks';

export const handle = sequence(
  authorizationMiddleware,
);