<script lang="ts">
	import {
		RenderRichText,
		richTextJSONToText,
		type RichTextNodeRendererProps
	} from '@bienbien/rime/fields/rich-text';

	const { node, components }: RichTextNodeRendererProps = $props();

	const element = $derived(`h${node.attrs?.level || 2}`);
	const id = richTextJSONToText(node).replace(' ', '-');
</script>

<svelte:element this={element} {...node.attrs} {id}>
	<RenderRichText {components} json={node} />
</svelte:element>
