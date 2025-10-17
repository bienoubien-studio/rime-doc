/**
 * BulletList node renderer - converts bullet list nodes to Markdown unordered lists
 * @param {{type: 'bullet_list', content: any[]}} node - The bullet list node
 * @param {Record<string, (node: any, renderers: any) => any>} renderers - Renderer function map
 * @returns {string} The rendered markdown unordered list
 */

import { parseParagraph } from './paragraph.js';
export const bulletList = (/** @type {any} */ node, /** @type {any} */ renderers) => {
	if (!node.content || !Array.isArray(node.content)) {
		return '';
	}

	return node.content
		.map((/** @type {any} */ child) => {
			const renderer = renderers[child.type];
			if (!renderer) {
				console.warn(`No renderer found for node type: ${child.type}`);
				return '';
			}
			return renderer(child, renderers);
		})
		.join('\n');
};

/**
 * Parses markdown bullet list to JSON
 * @param {string[]} lines - Array of markdown lines
 * @param {number} startIndex - Starting line index
 * @returns {{node: {type: string, content: Array<any>}, endIndex: number}} Object with bulletList node and ending line index
 */
export const parseBulletList = (lines, startIndex) => {
	const listItems = [];
	let i = startIndex;

	while (i < lines.length) {
		const currentLine = lines[i].trim();

		if (!currentLine) {
			i++;
			break;
		}

		if (currentLine.startsWith('- ')) {
			const text = currentLine.replace(/^-\s/, '');
			// Parse the text for inline formatting (links, bold, code, etc.)
			const parsedParagraph = parseParagraph(text);
			listItems.push({
				type: 'listItem',
				content: [parsedParagraph]
			});
			i++;
		} else {
			break;
		}
	}

	return {
		node: {
			type: 'bulletList',
			content: listItems
		},
		endIndex: i - 1
	};
};

/**
 * Checks if a line matches this block type
 * @param {string} line - The line to check
 * @returns {boolean} Whether the line matches bullet list format
 */
export const matchesBulletList = (line) => line.trim().startsWith('- ');
