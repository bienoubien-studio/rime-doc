import Paragraph from '@tiptap/extension-paragraph';
import type { ParseMarkdownFn, ParseResult } from '../index.js';

/**
 * Paragraph node renderer - handles paragraph structure
 */

export const paragraphRenderer = {
	type: 'node',
	inline: Paragraph.config.inline,
	content: Paragraph.config.content,
	matcher: /^(.*)(?:\n|$)/,

	/**
	 * Checks if markdown line should be treated as a paragraph
	 */
	match(input: string) {
		return input.match(this.matcher);
	},

	/**
	 * Parses markdown paragraph to JSON
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

		const inlineRenderers = renderers.filter((r) => r.inline);
		const inlineMatch = inlineRenderers.map((r) => !!r.match(group[1])).filter(Boolean).length;

		// Find text renderer and delegate content parsing
		const content = inlineMatch
			? await parseMarkdown(group[1], inlineRenderers)
			: [{ text: group[1], type: 'text' }];

		return {
			node: {
				content,
				type: 'paragraph'
			},
			consumed: group[0].length
		};
	}
};
