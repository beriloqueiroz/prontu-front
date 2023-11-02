import { authorizationMiddleware } from '$lib/middleware/authorization';
import { sequence } from '@sveltejs/kit/hooks';

export const handle = sequence(
  authorizationMiddleware,
);