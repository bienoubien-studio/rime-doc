
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Dictionaries } from '@bienbien/rime/i18n';
	import i18n from '@bienbien/rime/i18n';
	import '@bienbien/rime/panel/style/index.css';

	type Props = { children: Snippet; data: { translations: Dictionaries } };

	const { children, data }: Props = $props();
	i18n.init(data.translations);

</script>

<div class="rz-root">
	{@render children()}
</div>