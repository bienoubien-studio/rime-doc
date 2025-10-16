import { env } from '$env/dynamic/public';
import { rime } from '$rime/config';
import { adapterSqlite } from '@bienbien/rime/sqlite';
import { nav } from './nav.js';
import { pages } from './pages.js';

export default rime({
	$adapter: adapterSqlite('doc.sqlite'),
	collections: [pages],
	areas: [nav],
	siteUrl: env.PUBLIC_RIME_URL
});
