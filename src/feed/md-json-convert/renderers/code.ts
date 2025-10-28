import type { ParseResult } from '../index.js';

/**
 * Code mark renderer - handles `text` formatting
 */

export const codeRenderer = {
	type: 'mark',
	inline: true,
	matcher: /`([^`]+)`/,

	/**
	 * Checks if markdown text contains code formatting
	 */
	match(input: string) {
		return input.match(this.matcher);
	},

	/**
	 * Converts code match to JSON mark
	 */
	async renderJSON(input: string): Promise<ParseResult | null> {
		const group = input.match(this.matcher);
		if (!group) return null;

		return {
			node: {
				marks: [{ type: 'code' }],
				text: group[1],
				type: 'text'
			},
			consumed: group[1].length + 2
		};
	}
};
