/**
 * OrderedList node renderer - converts ordered list nodes to Markdown numbered lists
 * @param {{type: string, attrs?: {start?: number}, content?: any[]}} node - The ordered list node
 * @param {Record<string, (node: any, renderers: any) => any>} renderers - Renderer function map
 * @returns {string} The rendered markdown numbered list
 */

import { parseParagraph } from './paragraph.js';

export const orderedList = (node, renderers) => {
	const start = node.attrs?.start || 1;

	if (!node.content || !Array.isArray(node.content)) {
		return '';
	}

	return node.content
		.map((child, index) => {
			const renderer = renderers[child.type];
			if (!renderer) {
				console.warn(`No renderer found for node type: ${child.type}`);
				return '';
			}

			const itemNumber = start + index;
			const renderedChild = renderer(child, renderers);
			// Replace the default list marker with numbered marker
			return renderedChild.replace(/^- /, `${itemNumber}. `);
		})
		.join('\n');
};

/**
 * Parses markdown ordered list to JSON
 * @param {string[]} lines - Array of markdown lines
 * @param {number} startIndex - Starting line index
 * @returns {{node: {type: string, attrs: {start: number, type: null}, content: Array<any>}, endIndex: number}} Object with orderedList node and ending line index
 */
export const parseOrderedList = (lines, startIndex) => {
	const listItems = [];
	let i = startIndex;

	while (i < lines.length) {
		const currentLine = lines[i].trim();

		if (!currentLine) {
			i++;
			break;
		}

		if (currentLine.match(/^\d+\.\s/)) {
			const numberMatch = currentLine.match(/^(\d+)\.\s/);
			const itemNumber = numberMatch ? parseInt(numberMatch[1], 10) : 1;
			const text = currentLine.replace(/^\d+\.\s/, '');
			// Parse the text for inline formatting (links, bold, code, etc.)
			const parsedParagraph = parseParagraph(text);
			listItems.push({
				type: 'listItem',
				attrs: { originalNumber: itemNumber },
				content: [parsedParagraph]
			});
			i++;
		} else {
			break;
		}
	}

	// Determine the actual start number from the first item
	const actualStart = listItems.length > 0 && listItems[0].attrs?.originalNumber ? listItems[0].attrs.originalNumber : 1;

	return {
		node: {
			type: 'orderedList',
			attrs: { start: actualStart, type: null },
			content: listItems
		},
		endIndex: i - 1
	};
};

/**
 * Checks if a line matches this block type
 * @param {string} line - The line to check
 * @returns {boolean} Whether the line matches ordered list format
 */
export const matchesOrderedList = (line) => !!line.trim().match(/^\d+\.\s/);
