<script lang="ts">
	import Blockquote from '$lib/components/rich-text/blockquote/Blockquote.svelte';
	import CodeBlock from '$lib/components/rich-text/code-block/CodeBlock.svelte';
	import Code from '$lib/components/rich-text/code/Code.svelte';
	import Heading from '$lib/components/rich-text/heading/Heading.svelte';
	import Resource from '$lib/components/rich-text/resource/Resource.svelte';
	import Table from '$lib/components/rich-text/table/Table.svelte';
	import TableCell from '$lib/components/rich-text/table/TableCell.svelte';
	import TableHeader from '$lib/components/rich-text/table/TableHeader.svelte';
	import TableRow from '$lib/components/rich-text/table/TableRow.svelte';
	import Tag from '$lib/components/rich-text/tag/tag.svelte';
	import Header from '$lib/components/sections/header/Header.svelte';
	import Nav from '$lib/components/sections/nav/Nav.svelte';
	import PageNav from '$lib/components/sections/page-nav/PageNav.svelte';
	import CardPagination from '$lib/components/ui/cards/CardPagination.svelte';
	import RenderRichText from './RenderRichText.svelte';
	// import { RenderRichText } from '@bienbien/rime/fields/rich-text';
	import type { WithRelationPopulated } from '@bienbien/rime/types';
	import { string } from '@bienbien/rime/util';

	type Props = { doc: WithRelationPopulated<PagesDoc>; pagination: Pagination; nav: NavDoc };

	const { doc, pagination, nav }: Props = $props();
</script>

<svelte:head>
	<title>{doc.title} -</title>
</svelte:head>

<Header border={true} />

<div class="page">
	<Nav {nav} />

	<main>
		<h1 id={string.slugify(doc.title)}>{doc.attributes.longTitle || doc.title}</h1>

		<div class="render-rich-text">
			<RenderRichText
				json={doc.content.text}
				components={{
					resource: Resource,
					codeBlock: CodeBlock,
					heading: Heading,
					code: Code,
					warnBlock: Blockquote,
					infoBlock: Blockquote,
					tag: Tag,
					'tag-warn': Tag,
					table: Table,
					tableRow: TableRow,
					tableCell: TableCell,
					tableHeader: TableHeader
				}}
			/>
		</div>

		<aside class="page-related">
			{#if pagination.prev}
				<CardPagination
					align="left"
					uptitle="Previous page"
					title={pagination.prev.title}
					link={pagination.prev.url}
				/>
			{:else}
				<div></div>
			{/if}

			{#if pagination.next}
				<CardPagination
					align="right"
					uptitle="Next page"
					title={pagination.next.title}
					link={pagination.next.url}
				/>
			{/if}
		</aside>
	</main>

	<PageNav pageTitle={doc.title} text={doc.content.text} />
	<!-- <Font /> -->
</div>

<style lang="postcss">
	h1 {
		@mixin font-title;
		font-size: var(--text-fluid-3xl);
		scroll-margin-top: calc(var(--size-16) + var(--header-height));
	}
	.page {
		display: grid;
		grid-template-columns: 320px 1fr 320px;
		max-width: 1640px;
	}
	main {
		margin-top: var(--size-12);
		margin-bottom: var(--size-12);
		margin-left: var(--size-12);
	}
	.render-rich-text {
		margin-top: var(--size-8);
	}
	.page-related {
		display: flex;
		width: 100%;
		justify-content: space-between;
		margin-top: var(--size-12);
		> * {
			flex-grow: 0;
			flex-shrink: none;
		}
	}
</style>
