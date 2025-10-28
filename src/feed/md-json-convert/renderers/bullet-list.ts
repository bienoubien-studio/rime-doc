import type { ParseMarkdownFn, ParseResult } from '../index.js';

/**
 * Bullet list node renderer
 */

export const bulletListRenderer = {
	type: 'node',
	matcher: /^(- .*(?:\n|$))+/,

	/**
	 * Checks if markdown line should be treated as a bulletList
	 */
	match(input: string) {
		return input.match(this.matcher);
	},

	/**
	 * Parses markdown bulletList to JSON
	 */
	async renderJSON(
		input: string,
		params: {
			renderers: any[];
			parseMarkdown: ParseMarkdownFn;
		}
	): Promise<ParseResult | null> {
		const { renderers, parseMarkdown } = params;

		const group = input.match(this.matcher);
		if (!group) return null;

		const lines = group[0].split('- ').slice(1);
		const listItems = [];

		for (const line of lines) {
			listItems.push({
				content: await parseMarkdown(line, renderers),
				type: 'listItem'
			});
		}

		return {
			node: {
				content: listItems,
				type: 'bulletList'
			},
			consumed: group[0].length
		};
	}
};
