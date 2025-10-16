import { env } from '$env/dynamic/public';
import { codeBlockFeature, codeFeature } from '$lib/rich-text-features/code-feature/code-feature';
import { infoBlockFeature } from '$lib/rich-text-features/info-feature/info-feature';
import { tableFeature } from '$lib/rich-text-features/table/table';
import { tagWarnMarkFeature } from '$lib/rich-text-features/tag-warn/tag-warn-feature';
import { tagMarkFeature } from '$lib/rich-text-features/tag/tag-feature';
import { warnBlockFeature } from '$lib/rich-text-features/warn-feature/warn-feature';
import { Collection, Hooks } from '$rime/config';
import { richText, slug, tab, tabs, text, textarea, toggle } from '@bienbien/rime/fields';
import {
    blockquote,
    bold,
    bulletList,
    heading,
    hr,
    link,
    orederedList,
    resource
} from '@bienbien/rime/fields/rich-text';

const refreshData = Hooks.afterUpdate(async (args) => {
	args.event.locals.rime.sse.broadcast({
		documentType: 'pages',
		id: args.doc.id,
		operation: 'update',
		timestamp: new Date().toISOString()
	});
	return args;
});

export const pages = Collection.create('pages', {
	panel: {
		group: 'content'
	},
	access: {
		read: () => true
	},
	$url: (doc) =>
		doc.attributes.isHome
			? `${env.PUBLIC_RIME_URL}/`
			: `${env.PUBLIC_RIME_URL}/docs/[...parent.attributes.slug]/${doc.attributes.slug}`,
	$hooks: {
		afterUpdate: [refreshData]
	},
	nested: true,
	fields: [
		tabs(
			tab('attributes')
				.label('Attributes')
				.fields(
					text('title').isTitle(),
					toggle('isHome'),
					slug('slug')
						.slugify('attributes.title')
						.condition((_, siblings) => siblings.isHome === false),
					textarea('longTitle'),
					textarea('summary'),
					text('icon')
				),
			tab('content')
				.label('Content')
				.fields(
					richText('text')
						.features(
							heading(2, 3, 4),
							bold(),
							link({ resources: [{ slug: 'pages' }] }),
							hr(),
							orederedList(),
							bulletList(),
							codeBlockFeature,
							codeFeature,
							blockquote(),
							warnBlockFeature,
							infoBlockFeature,
							tagMarkFeature,
							tagWarnMarkFeature,
							resource({ slug: 'pages' }),
							tableFeature
						)
						.$beforeRead(async (value, context) => {
							if ('content' in value && Array.isArray(value.content)) {
								for (const node of value.content) {
									if (node.type === 'resource' && node.attrs?.id) {
										const [document] = await context.event.locals.rime.collection('pages').find({
											query: `where[id][equals]=${node.attrs.id}`,
											select: [
												'url',
												'attributes.longTitle',
												'attributes.summary',
												'attributes.icon'
											]
										});
										if (document) {
											node.resource = document;
										}
									}
								}
							}
							return value;
						})
				)
		)
	]
});
