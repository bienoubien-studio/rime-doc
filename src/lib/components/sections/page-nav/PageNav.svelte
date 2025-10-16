<script lang="ts">
	import { richTextJSONToText } from '@bienbien/rime/fields/rich-text';
	import { string as str } from '@bienbien/rime/util';
	import { TableOfContents } from '@lucide/svelte';
	import type { JSONContent } from '@tiptap/core';

	type Props = { pageTitle: string; text: JSONContent | undefined };
	const { pageTitle, text }: Props = $props();

	const items = $derived.by(() => {
		if (!text || !Array.isArray(text.content)) {
			return [];
		}
		const hasContentText = (node: JSONContent): node is { content: { text: string }[] } =>
			Array.isArray(node.content) && !!node.content[0] && !!node.content[0].text;

		return [
			{
				label: pageTitle,
				id: str.slugify(pageTitle)
			},
			...text.content
				.filter((node) => node.type === 'heading')
				.filter(hasContentText)
				.map((node) => ({
					label: node.content[0].text,
					id: str.slugify(richTextJSONToText(node))
				}))
		];
	});

	let activeId = $state(str.slugify(pageTitle));

	// Intersection Observer to track visible headings
	$effect(() => {
		const ids = items.map((item) => item.id);

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const id = entry.target.id;
						if (ids.includes(id)) {
							activeId = id;
						}
					}
				});
			},
			{
				rootMargin: '0px 0px -60% 0px', // Trigger when heading is in the top 40% of viewport
				threshold: 0
			}
		);

		// Observe all elements with IDs from items
		ids.forEach((id) => {
			const element = document.getElementById(id);
			if (element) {
				observer.observe(element);
			}
		});

		return () => {
			observer.disconnect();
		};
	});
</script>

<div>
	<aside>
		<h2><TableOfContents size="14" /> On this page</h2>
		<ul>
			{#each items as item (item.id)}
				<li><a href="#{item.id}" class:active={activeId === item.id}>{item.label}</a></li>
			{/each}
		</ul>
	</aside>
</div>

<style lang="postcss">
	h2 {
		@mixin font-title;
		margin-bottom: var(--size-4);
		display: flex;
		align-items: center;
		gap: var(--size-2);
	}
	aside {
		position: sticky;
		top: calc(var(--header-height) + var(--size-12));
		padding: 0 var(--size-12);
	}

	ul {
		margin-left: var(--size-4);
		display: grid;
		gap: var(--size-2);
	}
	a {
		display: block;
		color: oklch(var(--light-12) 0 0);
		text-decoration: none;
		border-left: 1px solid transparent;
		padding-left: var(--size-3);
		margin-left: calc(-1 * var(--size-3));
		transition: all 0.2s ease;
	}

	a:hover {
		color: var(--color-fg);
	}

	a.active {
		color: var(--color-fg);
		border-left-color: var(--color-fg);
		font-weight: 500;
	}
</style>
