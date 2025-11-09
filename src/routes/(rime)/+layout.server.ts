
import type { ServerLoadEvent } from '@sveltejs/kit';
import { registerTranslation } from 'rimecms/i18n/register.server.js';

export const ssr = false;

export const load = async ({ locals }: ServerLoadEvent) => {
	const { user, rime } = locals;
	const translations = await registerTranslation(rime.config.raw.panel.language);
	return { user, translations };
};