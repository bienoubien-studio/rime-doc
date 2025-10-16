<script lang="ts">
	import Header from '$lib/components/sections/header/Header.svelte';
	import Button from '$lib/components/ui/button/Button.svelte';
	import type { WithRelationPopulated } from '@bienbien/rime/types';

	type Props = { doc: WithRelationPopulated<PagesDoc>; version: string | null };
	const { doc, version }: Props = $props();
</script>

<svelte:head>
	<title>{doc.title} -</title>
</svelte:head>

<Header />

<section>
	<header>
		<aside>
			<a class="git-link" href="https://github.com/bienoubien-studio/rime" target="_blank">
				v{version}
				View on github
			</a>
		</aside>
		<h1>
			{@html doc.attributes.longTitle
				?.replace('\n', '<br/>')
				.replace('{', '<strong>')
				.replace('}', '</strong>')}
		</h1>
		<p>{doc.attributes.summary}</p>
		<div>
			<Button href="/docs/introduction" size="lg" variant="gradient">Get started</Button>
		</div>
	</header>
	<img src="/rime-preview.jpg" alt="preview of the admin panel" />
</section>

<style lang="postcss">
	section {
		height: 70vh;
		display: grid;
		place-content: center;
	}
	header {
		margin: var(--size-12) auto;
		text-align: center;
		justify-content: center;
		display: grid;
		gap: var(--size-6);
		max-width: 700px;
		position: relative;
	}
	img {
		position: absolute;
		inset: 0;
		top: 65vh;
		object-fit: contain;
		z-index: -1;
	}
	aside {
		font-size: var(--text-sm);
	}
	h1 {
		@mixin font-title;
		:global(strong) {
			@mixin font-brand;
		}
		font-size: var(--text-8xl);
	}
	p {
		opacity: 0.6;
		max-width: 600px;
		font-size: var(--text-lg);
	}
	.git-link {
		border-radius: var(--size-6);
		padding: var(--size-1) var(--size-3);
		display: inline-block;
		border: 1px solid oklch(var(--light-10) 0 0);
		font-size: var(--text-xs);
		font-family: 'geist-mono';
	}
</style>
