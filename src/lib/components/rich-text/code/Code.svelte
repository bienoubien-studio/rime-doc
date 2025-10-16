<script lang="ts">
	import type { RichTextNodeRendererProps } from '@bienbien/rime/fields/rich-text';

	const { node }: RichTextNodeRendererProps = $props();
</script>

<span class="code-mark">
	{#if node.text}
		{node.text}
	{/if}
</span>

<style>
	.code-mark {
		font-family: 'geist-mono';
		background-color: var(--color-bg--accent);
		padding-left: var(--size-1);
		padding-right: var(--size-1);
		border-radius: var(--size-1);
		font-size: var(--text-sm);
	}
</style>
