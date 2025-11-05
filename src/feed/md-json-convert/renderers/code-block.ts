import type { ParseResult } from '../index.js';

/**
 * Code block node renderer
 */

export const codeBlockRenderer = {
	type: 'node',
	matcher: /^```([^\n]*)\n([\s\S]*?)(?:\n)?```/,

	/**
	 * Checks if markdown line should be treated as a codeBlock
	 */
	match(input: string) {
		return input.match(this.matcher);
	},

	/**
	 * Parses markdown codeBlock to JSON
	 */
	renderJSON(input: string): ParseResult | null {
		const group = input.match(this.matcher);
		if (!group) return null;

		const [, language, code] = group;

		return {
			node: {
				attrs: {
					language
				},
				content: [
					{
						text: code,
						type: 'text'
					}
				],
				type: 'codeBlock'
			},
			consumed: group[0].length
		};
	}
};
