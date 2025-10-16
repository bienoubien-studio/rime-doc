<script lang="ts">
	import type { RichTextNodeRendererProps } from '@bienbien/rime/fields/rich-text';

	const { node, children }: RichTextNodeRendererProps = $props();
</script>

<td {...node.attrs}>
	{@render children?.()}
</td>

<style>
	td {
		font-size: var(--text-sm);
		padding: var(--size-3);
		padding-left: var(--size-1);
	}

	td:nth-child(2) {
		font-size: var(--text-xs);
		color: oklch(var(--light-10) 0.2 var(--hue-primary));
		font-family: var(--font-mono);
	}
</style>
