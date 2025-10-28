/**
 * Heading renderer - handles # text formatting
 */

import type { ParseMarkdownFn, ParseResult } from '..';

export const headingRenderer = {
	type: 'node',
	matcher: /^(#{1,6})\s(.*)\n/,

	/**
	 * Checks if markdown text contains heading formatting
	 */
	match(input: string) {
		return input.match(this.matcher);
	},

	/**
	 * Converts bold match to JSON mark
	 */
	async renderJSON(
		input: string,
		params: {
			renderers: any[];
			parseMarkdown: ParseMarkdownFn;
		}
	): Promise<ParseResult | null> {
		const { renderers, parseMarkdown } = params;
		const group = input.match(this.matcher); // Remove ** and **

		if (!group) return null;

		const level = group[1].length;
		const text = group[2].trim();

		const inlineRenderers = renderers.filter((r) => r.inline);
		const inlineMatch = inlineRenderers.map((r) => !!r.match(group[1])).filter(Boolean).length;

		// Find text renderer and delegate content parsing
		const content = inlineMatch
			? await parseMarkdown(text, inlineRenderers)
			: [{ text: text, type: 'text' }];

		return {
			node: {
				attrs: { level },
				content,
				type: 'heading'
			},
			consumed: group[0].length
		};
	}
};
