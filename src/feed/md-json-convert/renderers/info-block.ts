import type { ParseMarkdownFn, ParseResult } from '../index.js';

/**
 * InfoBlock node renderer - handles > [!INFO] some usefull things
 */

export const infoBlockRenderer = {
	type: 'node',
	matcher: /^> \[!INFO\]\s(.*)(?:\n|$)/,

	/**
	 * Checks if markdown line should be treated as a infoBlock
	 */
	match(input: string) {
		return input.match(this.matcher);
	},

	/**
	 * Parses markdown infoBlock to JSON
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

		if (!group) {
			return null;
		}

		// Find text renderer and delegate content parsing
		const content = await parseMarkdown(group[1], renderers);

		return {
			node: {
				attrs: {
					dataType: 'info'
				},
				content,
				type: 'infoBlock'
			},
			consumed: group[0].length
		};
	}
};
