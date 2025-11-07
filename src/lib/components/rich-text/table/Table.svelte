<script lang="ts">
	import type { RichTextNodeRendererProps } from '@bienbien/rime/fields/rich-text';

	const { node, children }: RichTextNodeRendererProps = $props();
</script>

<table {...node.attrs}>
	<tbody>
		{@render children?.()}
	</tbody>
</table>

<style>
	table {
		margin-block: var(--size-2);
	}
</style>
