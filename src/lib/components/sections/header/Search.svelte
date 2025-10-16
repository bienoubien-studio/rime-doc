<script lang="ts">
	import Button from '$lib/components/ui/button/Button.svelte';
	import Shortcut from '$lib/components/ui/shortcut/Shortcut.svelte';
	import { Search } from '@lucide/svelte';

	// type Props = {  }
	// const { }: Props = $props()
</script>

<Button
	size="lg"
	--border-radius="var(--size-1)"
	--color="oklch(var(--light-11) 0 0)"
	--font-size="var(--text-sm)"
	--px="var(--size-4)"
	variant="ghost-gradient"
>
	<Search size="12" /> Search <span></span>
	<Shortcut>K</Shortcut>
</Button>

<style lang="postcss">
	span {
		flex: 2;
	}
</style>
