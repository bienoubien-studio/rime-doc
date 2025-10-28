/**
 * Text node renderer - handles text content and delegates to mark renderers for inline formatting
 * Self-responsible renderer that processes plain text with cursor-based parsing
 */

import type { ParseResult } from '../index.js';

export const textRenderer = {
	type: 'node',
	inline: true,

	match() {
		return true;
	},

	/**
	 * Parses text content and applies marks from available mark renderers
	 */
	async renderJSON(input: string): Promise<ParseResult | null> {
		return {
			node: {
				text: input,
				type: 'text'
			},
			consumed: input.length
		};
	}
};
