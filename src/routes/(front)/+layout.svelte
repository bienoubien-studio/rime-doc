<script lang="ts">
	import '$lib/styles/index.css';
	import { ModeWatcher } from 'mode-watcher';
	import { type Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();
</script>

<ModeWatcher />
{@render children()}
