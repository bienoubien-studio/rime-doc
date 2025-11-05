import type { ParseMarkdownFn, ParseResult } from '../index.js';

/**
 * Bullet list node renderer
 */

export const orderedListRenderer = {
	type: 'node',
	matcher: /^(\d+\.\s.*(?:\n|$))+/,

	/**
	 * Checks if markdown line should be treated as a orderedList
	 */
	match(input: string) {
		return input.match(this.matcher);
	},

	/**
	 * Parses markdown orderedList to JSON
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

		const matchStart = group[0].match(/^(\d+)/);
		const start = Number(matchStart ? matchStart[1] : 1);
		const lines = group[0].split(/\d+\.\s/).slice(1);
		const listItems = [];

		for (const line of lines) {
			listItems.push({
				content: await parseMarkdown(line, renderers),
				type: 'listItem'
			});
		}

		return {
			node: {
				attrs: {
					start,
					type: null
				},
				content: listItems,
				type: 'orderedList'
			},
			consumed: group[0].length
		};
	}
};
