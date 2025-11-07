/**
 * Main entry point for the MD-JSON converter
 * TypeScript implementation with cursor-based parsing
 * Each renderer handles its complete pattern matching
 */
import type { JSONContent } from '@tiptap/core';
import { boldRenderer } from './renderers/bold.js';
import { bulletListRenderer } from './renderers/bullet-list.js';
import { codeBlockRenderer } from './renderers/code-block.js';
import { codeRenderer } from './renderers/code.js';
import { headingRenderer } from './renderers/heading.js';
import { infoBlockRenderer } from './renderers/info-block.js';
import { linkRenderer } from './renderers/link.js';
import { orderedListRenderer } from './renderers/ordered-list.js';
import { paragraphRenderer } from './renderers/paragraph.js';
import { resourceRenderer } from './renderers/resource.js';
import { tableRenderer } from './renderers/table.js';
import { tagWarnRenderer } from './renderers/tag-warn.js';
import { tagRenderer } from './renderers/tag.js';
import { textRenderer } from './renderers/text.js';

/**
 * Parse result with consumed length
 */
export interface ParseResult {
	node: JSONContent;
	consumed: number;
}

/**
 * Document node type
 */
export interface DocNode {
	type: 'doc';
	content: JSONContent[];
}

// All renderers
const allRenderers = [
	resourceRenderer,
	infoBlockRenderer,
	bulletListRenderer,
	orderedListRenderer,
	codeBlockRenderer,
	headingRenderer,
	tableRenderer,
	paragraphRenderer,
	boldRenderer,
	codeRenderer,
	linkRenderer,
	tagRenderer,
	tagWarnRenderer,
	textRenderer
];
const nodeRenderers = allRenderers.filter((r) => r.type === 'node');

/**
 * Skips empty lines and returns new cursor position
 */
function skipEmptyLines(markdown: string, cursor: number): number {
	while (cursor < markdown.length) {
		const char = markdown[cursor];
		if (char === '\n' || char === '\r') {
			cursor++;
		} else if (char === ' ' || char === '\t') {
			// Skip whitespace, but check if we're at start of line with only whitespace
			let lineStart = cursor;
			while (
				lineStart > 0 &&
				markdown[lineStart - 1] !== '\n' &&
				markdown[lineStart - 1] !== '\r'
			) {
				lineStart--;
			}
			let lineEnd = cursor;
			while (
				lineEnd < markdown.length &&
				markdown[lineEnd] !== '\n' &&
				markdown[lineEnd] !== '\r'
			) {
				lineEnd++;
			}
			const lineContent = markdown.slice(lineStart, lineEnd).trim();
			if (lineContent === '') {
				cursor = lineEnd;
			} else {
				break;
			}
		} else {
			break;
		}
	}
	return cursor;
}

/**
 * Converts Markdown to ProseMirror JSON using cursor-based parsing
 */
export async function markdownToJson(input: string): Promise<DocNode> {
	const withoutLeading = input.replace(/^[\n\r\s]+/, '');

	const content = await parseMarkdown(withoutLeading, nodeRenderers);
	return {
		type: 'doc',
		content
	};
}

export async function parseMarkdown(input: string, renderers: any[]) {
	const content: any[] = [];

	let cursor = 0;

	while (cursor < input.length) {
		// Skip empty lines
		cursor = skipEmptyLines(input, cursor);

		if (cursor >= input.length) {
			break;
		}

		const remaining = input.slice(cursor);
		let matched = false;

		// Find the earliest matching renderer and its position
		let earliestMatch = null;
		let earliestPosition = Infinity;

		for (const renderer of renderers) {
			const match = renderer.match(remaining);
			if (match && match.index !== undefined && match.index < earliestPosition) {
				earliestPosition = match.index;
				earliestMatch = { renderer, match };
			}
		}

		if (earliestMatch) {
			// If earliest match is not at cursor 0, create text node for the gap
			if (earliestPosition > 0) {
				const textContent = remaining.slice(0, earliestPosition);
				content.push({
					text: textContent,
					type: 'text'
				});
				cursor += earliestPosition;
				matched = true;
			} else {
				// Process the matched renderer
				const result = await earliestMatch.renderer.renderJSON(remaining, {
					parseMarkdown,
					renderers: allRenderers
				});

				if (result && typeof result === 'object') {
					let node: any;
					let consumed: number;

					if ('node' in result && 'consumed' in result) {
						// New cursor-based result
						node = result.node;
						consumed = result.consumed;
						// Validate the result
						if (node && consumed > 0) {
							content.push(node);
							cursor += consumed;
							matched = true;
						}
					}
				}
			}
		}

		// If no renderer matched ends with text
		if (!matched) {
			const remainingText = input.slice(cursor);
			if (remainingText.trim().length > 0) {
				content.push({
					text: remainingText,
					type: 'text'
				});
			}
			cursor += remainingText.length;
		}
	}

	return content;
}

export type ParseMarkdownFn = typeof parseMarkdown;
