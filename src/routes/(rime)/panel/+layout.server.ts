
import { type ServerLoadEvent } from '@sveltejs/kit';

export const load = async ({ locals }: ServerLoadEvent) => {
  const { user, locale, routes } = locals;
  return { user, locale, routes };
};