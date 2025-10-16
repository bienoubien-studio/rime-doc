<script lang="ts">
	import type { RichTextNodeRendererProps } from '@bienbien/rime/fields/rich-text';

	const { node, children }: RichTextNodeRendererProps = $props();
</script>

<tr {...node.attrs}>
	{@render children?.()}
</tr>

<style>
	tr {
		display: block grid;
		grid-template-columns: 1fr 1fr 2fr;
	}
	tr:not(:first-child) {
		min-height: var(--size-12);
		border-top: 1px solid oklch(from var(--color-fg) l c h / 0.1);
	}
</style>
