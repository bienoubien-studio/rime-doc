
<script>
	import { Panel } from 'rimecms/panel/client';

	import config from '$lib/+rime.generated/rime.config.js';
	const { children, data } = $props();

	const user = data.user;
	if (!user) throw new Error('unauthorized');
</script>

<Panel {config} {user} routes={data.routes} locale={data.locale}>
    {@render children()}
</Panel>