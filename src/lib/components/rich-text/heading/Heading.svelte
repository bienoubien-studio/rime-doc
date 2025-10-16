<script lang="ts">
	import {
		RenderRichText,
		richTextJSONToText,
		type RichTextNodeRendererProps
	} from '@bienbien/rime/fields/rich-text';
	import { string as str } from '@bienbien/rime/util';

	const { node, components }: RichTextNodeRendererProps = $props();

	const element = $derived(`h${node.attrs?.level || 2}`);
	const id = str.slugify(richTextJSONToText(node));
</script>

<svelte:element this={element} {...node.attrs} {id}>
	<RenderRichText {components} json={node} />
</svelte:element>
