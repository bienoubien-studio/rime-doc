import { handlers } from '@bienbien/rime';
import { sequence } from '@sveltejs/kit/hooks';
import config from './lib/+rime.generated/rime.config.server.js';

export const handle = sequence(...(await handlers(config)));
