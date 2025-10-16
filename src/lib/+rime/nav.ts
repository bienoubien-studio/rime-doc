import { Area } from '$rime/config';
import { link, text, tree } from '@bienbien/rime/fields';

export const nav = Area.create('nav', {
	fields: [
		//
		tree('main')
			.maxDepth(1)
			.fields(
				//
				text('label'),
				link('pages').types('pages')
			)
			.renderTitle((block) => block.values.label || block.position)
	],
	access: {
		read: () => true
	}
});
